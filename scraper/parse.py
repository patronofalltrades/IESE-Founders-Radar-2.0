import re,html,json,sys,glob,collections
R=sys.argv[1]
def txt(s): return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',s))).strip()
def num(p): return int(re.search(r'_(\d+)\.html',p).group(1))
def img(s):
    m=re.search(r'background:url\(([^)]*)\)',s); u=m.group(1).strip() if m else ''
    return u if re.search(r'/[A-Za-z0-9]',u.split('t_cb-default-original')[-1]) and not u.endswith('/') else ''
startups=[]
for p in sorted(glob.glob(R+'/s_*.html'),key=num):
    s=open(p,encoding='utf-8').read()
    for c in s.split('<div class="startup_card">')[1:]:
        c=c.split('<div class="pagination"')[0]
        m=re.search(r'class="startupname"><a href="([^"]*)"[^>]*>(.*?)</a>',c,re.S)
        det=[txt(x) for x in re.findall(r'<td class="st_details">(.*?)</td>',c,re.S)]
        d={'name':txt(m.group(2)),'cb':m.group(1).strip(),'logo':img(c.split('st2')[0])}
        j=' '.join(det)
        m2=re.search(r'Last Funding Event: ?(\d+ \w+ \d{4})',j); d['lastFunding']=m2.group(1) if m2 else ''
        m2=re.search(r'Founded (\d{4})',j); d['founded']=int(m2.group(1)) if m2 else None
        m2=re.search(r'(\S+) total raised',j); d['raised']=m2.group(1) if m2 else ''
        m2=re.search(r'class="st_description">(.*?)</td>',c,re.S); d['desc']=txt(m2.group(1)) if m2 else ''
        parts=re.split(r'OTHER FOUNDERS',c.split('st3')[0])
        d['founders']=[]
        for row in re.findall(r'<tr>(.*?)</tr>',parts[0].split('IESE FOUNDERS')[-1] if 'IESE FOUNDERS' in parts[0] else '',re.S):
            m3=re.search(r'<a href="([^"]*)"[^>]*style="color[^>]*><b>(.*?)</b></a>(.*?)(?:<a|</span>)',row,re.S)
            if not m3: continue
            lk=re.search(r'href="(https?://[^"]*linkedin[^"]*)"',row)
            sch=re.search(r'class="st_details">(.*?)</span>',row,re.S)
            d['founders'].append({'name':txt(m3.group(2)),'cb':m3.group(1),'role':txt(m3.group(3)).lstrip(', '),'li':lk.group(1) if lk else '','photo':img(row),'school':txt(sch.group(1)) if sch else ''})
        d['others']=[{'name':txt(n),'cb':u} for u,n in re.findall(r'<a href="([^"]*)"[^>]*><b>(.*?)</b>',parts[1],re.S)] if len(parts)>1 else []
        st3=c.split('boxstartup st3')[1].split('boxstartup st4')[0] if 'boxstartup st3' in c else ''
        d['news']=[]
        for u,t,meta in re.findall(r'<th[^>]*><a href="([^"]*)"[^>]*>(.*?)</a></th>\s*</tr>\s*<tr>\s*<td[^>]*>(.*?)</td>',st3,re.S):
            u=html.unescape(u).strip().split(', content:')[0]
            pub,_,date=txt(meta).partition('|')
            d['news'].append({'url':u,'title':txt(t),'pub':pub.strip(),'date':date.strip()})
        m2=re.search(r'last updated: ([^<]*)<',c); d['updated']=m2.group(1).strip() if m2 else ''
        startups.append(d)
founders=[]
for p in sorted(glob.glob(R+'/f_*.html'),key=num):
    s=open(p,encoding='utf-8').read()
    for c in s.split('<div class="people_card">')[1:]:
        m=re.search(r'<h3><a href="([^"]*)"[^>]*>(.*?)</a></h3>',c,re.S)
        m2=re.search(r'<h4>(?:<a href="([^"]*)"[^>]*>(.*?)</a>)?(.*?)</h4>',c,re.S)
        m3=re.search(r'<h5>(.*?)</h5>',c,re.S)
        li=re.search(r'href="([^"]*linkedin\.com[^"]*)"',c); x=re.search(r'href="(https?://(?:x|twitter)\.com[^"]*)"',c)
        founders.append({'name':txt(m.group(2)),'cb':m.group(1),'photo':img(c),'company':txt(m2.group(2) or '') if m2 else '','companyCb':(m2.group(1) or '') if m2 else '','role':txt(m2.group(3)).strip('() ') if m2 else '','school':txt(m3.group(1)).strip('. ') if m3 else '','li':li.group(1) if li else '','x':x.group(1) if x else ''})
json.dump({'startups':startups,'founders':founders},open(sys.argv[2],'w'),ensure_ascii=False)
print(len(startups),'startup cards,',len(founders),'founder cards')
