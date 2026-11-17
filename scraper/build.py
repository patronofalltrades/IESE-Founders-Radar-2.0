import json,re,sys,collections,datetime,html
d=json.load(open(sys.argv[1]))
MON={m:i+1 for i,m in enumerate('Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split())}
def iso(s):
    s=s.strip()
    m=re.match(r'(\d{4})-(\d\d)-(\d\d)',s)
    if m: return m.group(0)
    m=re.match(r'(\d{1,2}) (\w{3})\w* (\d{4})',s)
    if m and m.group(2) in MON: return '%s-%02d-%02d'%(m.group(3),MON[m.group(2)],int(m.group(1)))
    m=re.match(r'(\w{3})\w* (\d{1,2}), (\d{4})',s)
    if m and m.group(1) in MON: return '%s-%02d-%02d'%(m.group(3),MON[m.group(1)],int(m.group(2)))
    return ''
def money(s):
    m=re.match(r'€([\d.,]+)([KMB]?)$',s)
    if not m: return None
    return round(float(m.group(1).replace(',',''))*{'':1,'K':1e3,'M':1e6,'B':1e9}[m.group(2)])
slug=lambda u:u.rstrip('/').rsplit('/',1)[-1]
key=lambda t:re.sub(r'\W+','',t.casefold())
# Second Crunchbase profile of a company already listed -> the profile it is folded into.
# Only pairs checked by hand: same name and founding year alone is not enough (Duplo, Beston and Impactmedia are different firms).
MERGE={'cabital-5a9e':'cabital','deallaunch-ai-fd83':'deallaunch-ai'}
def uniq(rows,used):
    r=[]
    for x in rows:
        k=key(x[0])
        if k not in used: used.add(k); r.append(x)
    return r
seen={};out=[]
for s in d['startups']:
    k=slug(s['cb'])
    if k in seen: continue
    news=[];nu=set();nt=set()
    for n in s['news']:
        u=html.unescape(n['url']);t=html.unescape(n['title'])
        if u in nu or key(t) in nt or not u.startswith('http'): continue
        nu.add(u); nt.add(key(t)); news.append([t,html.unescape(n['pub']),iso(n['date']),u])
    o={'id':k,'n':s['name'],'d':s['desc']}
    if s['founded']: o['y']=s['founded']
    r=money(s['raised'])
    if r: o['r']=r
    if s['lastFunding']: o['lf']=iso(s['lastFunding'])
    if s['updated']: o['u']=iso(s['updated'])
    f=[[x['name'],x['role'],x['li'],slug(x['cb'])] for x in s['founders']]
    if f:o['f']=f
    of=[[x['name'],slug(x['cb'])] for x in s['others']]
    if of:o['o']=of
    if news:o['h']=news
    seen[k]=o
    if k not in MERGE: out.append(o)
for a,b in MERGE.items():
    if a not in seen or b not in seen: continue
    a=seen[a];b=seen[b]
    for f in 'y','r','lf':
        if f in a: b.setdefault(f,a[f])
    for f in 'f','o','h':
        if f in a: b[f]=b.get(f,[])+a[f]
    if 'h' in b: b['h']=sorted(b['h'],key=lambda n:n[2],reverse=True)[:3]
for o in out:
    names=set()
    for f in 'f','o','h':
        if f in o:
            o[f]=uniq(o[f],set() if f=='h' else names)
            if not o[f]: del o[f]
ps={};people=[]
for f in d['founders']:
    k=slug(f['cb']);same=tuple(v for n,v in sorted(f.items()) if n not in('cb','photo'))
    if k in ps or same in ps: continue
    ps[k]=ps[same]=1
    c=slug(f['companyCb']) if f['companyCb'] else ''
    c=MERGE.get(c,c)
    people.append({'id':k,'n':f['name'],'c':f['company'],'ci':c,'in':int(c in seen),'ro':f['role'],'li':f['li'],'x':f['x'],'p':f['school'].replace('IESE Business School','').strip('. ')})
json.dump({'scraped':datetime.date.today().isoformat(),'startups':out,'founders':people},open(sys.argv[2],'w'),ensure_ascii=False,separators=(',',':'))
print(len(out),len(people),'raised n',sum('r' in o for o in out),'sum',sum(o.get('r',0) for o in out)/1e9)
