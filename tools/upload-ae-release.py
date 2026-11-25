"""Upload the approved AE archive using the existing Git credential helper.

Credentials remain in memory and are never written to files or printed.
The large archive stays in GitHub release assets, outside normal Git history.
"""
from pathlib import Path
import subprocess, json, urllib.request, urllib.error, http.client, sys
ROOT=Path(__file__).resolve().parents[1]
REPO='Hassan-Ghaznavi/hassan-portfolio'; TAG='ae-video-2026-11-25'
out=ROOT/'output/ae-video'
result=subprocess.run(['git','credential','fill'],input='protocol=https\nhost=github.com\n\n',text=True,capture_output=True,check=True,timeout=30)
fields=dict(line.split('=',1) for line in result.stdout.splitlines() if '=' in line)
token=fields.get('password')
if not token:raise SystemExit('Existing GitHub credential unavailable')
headers={'Authorization':'Bearer '+token,'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'Hassan-Portfolio-AE-Delivery'}
def api(method,path,data=None):
 payload=json.dumps(data).encode() if data is not None else None
 req=urllib.request.Request('https://api.github.com'+path,data=payload,headers={**headers,'Content-Type':'application/json'},method=method)
 with urllib.request.urlopen(req,timeout=45) as response:return json.load(response)
base='/repos/'+REPO+'/releases'
if '--publish' in sys.argv:
 record=json.loads((out/'github-release.json').read_text())
 release=api('PATCH',base+'/'+str(record['id']),{'draft':False,'target_commitish':'main'})
 print(json.dumps({'published':not release['draft'],'url':release['html_url'],'assets':[(a['name'],a['size']) for a in release['assets']]}),flush=True)
 raise SystemExit()

manifest=json.loads((out/'ae-package-manifest.json').read_text())
try:release=api('GET',base+'/tags/'+TAG)
except urllib.error.HTTPError as error:
 if error.code!=404:raise SystemExit('GitHub release lookup failed: '+str(error.code))
 release=api('POST',base,{'tag_name':TAG,'target_commitish':'main','name':'AE Video - The Manual Is Wrong','draft':True,'prerelease':False,'body':
 '## AE Video\n\nComplete After Effects production folder supplied by Hassan, preserved as one ZIP.\n\n'
 '- Selected film: MAIN_The_Manual_Is_Wrong_1080p.mp4 (60 seconds, 1920x1080, stereo audio).\n'
 '- Contains all 356 supplied files: native .aep revisions, footage, audio, scripts, frame sequences, reference material, original export and backups/logs. Alternate/corrupt backups are retained as supplied; open the intended valid AE revision for evaluation.\n'
 '- The live portfolio uses an optimized click-to-load copy with audio.\n'
 '- The large source ZIP is excluded from the Vercel build.\n\n'
 'Archive SHA-256: `'+manifest['sha256']+'`\n\nLive portfolio: https://hassan-portfolio-two-rho.vercel.app/#portfolio-film\n\nSee the attached per-file manifest and SHA256SUMS for integrity verification.'})
(out/'github-release.json').write_text(json.dumps({'id':release['id'],'tag':TAG,'url':release['html_url']},indent=2),encoding='utf-8')
existing={a['name']:a for a in release['assets']}
for name in ['The_Manual_Is_Wrong_AE.zip','SHA256SUMS.txt','ae-package-manifest.json']:
 path=out/name
 if name in existing:
  if existing[name]['size']!=path.stat().st_size:raise SystemExit('Existing release asset differs; no replacement performed')
  print('Already uploaded: '+name,flush=True);continue
 kind='application/zip' if path.suffix=='.zip' else 'application/json' if path.suffix=='.json' else 'text/plain'
 connection=http.client.HTTPSConnection('uploads.github.com',timeout=60)
 endpoint=base+'/'+str(release['id'])+'/assets?name='+name
 connection.putrequest('POST',endpoint)
 for k,v in {**headers,'Content-Type':kind,'Content-Length':str(path.stat().st_size)}.items():connection.putheader(k,v)
 connection.endheaders();sent=0;reported=0
 with path.open('rb') as stream:
  for block in iter(lambda:stream.read(4*1024*1024),b''):
   connection.send(block);sent+=len(block)
   if sent-reported>=128*1024*1024:print(name+': '+str(round(sent/1e6))+' MB sent',flush=True);reported=sent
 response=connection.getresponse();data=json.loads(response.read());connection.close()
 if response.status!=201:raise SystemExit('GitHub upload failed: HTTP '+str(response.status))
 if data.get('size')!=path.stat().st_size:raise SystemExit('Uploaded asset size differs')
 if name.endswith('.zip') and data.get('digest') and data['digest']!='sha256:'+manifest['sha256']:raise SystemExit('Uploaded archive digest differs')
 print(json.dumps({'uploaded':data['name'],'bytes':data['size'],'url':data['browser_download_url'],'digest':data.get('digest')}),flush=True)
