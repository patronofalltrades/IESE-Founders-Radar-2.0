import json,re,sys,collections,datetime
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
seen={};out=[]
for s in d['startups']:
    k=slug(s['cb'])
    if k in seen: continue
    seen[k]=1
    news=[];nu=set()
    for n in s['news']:
        if n['url'] in nu or not n['url'].startswith('http'): continue
        nu.add(n['url']); news.append([n['title'],n['pub'],iso(n['date']),n['url']])
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
    out.append(o)
ps={};people=[]
for f in d['founders']:
    k=slug(f['cb'])
    if k in ps: continue
    ps[k]=1
    c=slug(f['companyCb']) if f['companyCb'] else ''
    people.append({'id':k,'n':f['name'],'c':f['company'],'ci':c,'in':int(c in seen),'ro':f['role'],'li':f['li'],'x':f['x'],'p':f['school'].replace('IESE Business School','').strip('. ')})
json.dump({'scraped':datetime.date.today().isoformat(),'startups':out,'founders':people},open(sys.argv[2],'w'),ensure_ascii=False,separators=(',',':'))
print(len(out),len(people),'raised n',sum('r' in o for o in out),'sum',sum(o.get('r',0) for o in out)/1e9)
