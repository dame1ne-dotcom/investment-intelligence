// Netlify Function: provider key stays server-side. Public quote proxy, restricted symbols.
const ALLOWED = new Set(['AAPL','MSFT','NVDA','VOO','QQQ','SPY']);
const cache = new Map();
exports.handler = async (event) => {
  const headers = {'Content-Type':'application/json','Cache-Control':'public, max-age=60'};
  const respond=(statusCode,data)=>({statusCode,headers,body:JSON.stringify(data)});
  const symbol=(event.queryStringParameters?.symbol||'').toUpperCase();
  const kind=event.queryStringParameters?.kind||'quote';
  if(!ALLOWED.has(symbol)||!['quote','history'].includes(kind))return respond(400,{error:'Unsupported ticker'});
  const key=process.env.TWELVE_DATA_API_KEY;
  if(!key)return respond(503,{error:'Market data not configured. Set TWELVE_DATA_API_KEY in Netlify environment variables.'});
  const cacheKey=symbol+':'+kind, old=cache.get(cacheKey);
  if(old&&Date.now()-old.at<300000)return respond(200,old.data);
  const params=new URLSearchParams({symbol,apikey:key});
  if(kind==='history'){params.set('interval','1day');params.set('outputsize','12')}
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),11000);
  try{
    const r=await fetch('https://api.twelvedata.com/'+(kind==='quote'?'quote':'time_series')+'?'+params,{signal:controller.signal});
    const data=await r.json();
    if(!r.ok||data.status==='error')return respond(502,{error:'Market data provider unavailable or rate limited',message:data.message||''});
    cache.set(cacheKey,{at:Date.now(),data});return respond(200,data);
  }catch(e){return respond(502,{error:'Unable to retrieve market data'})}
  finally{clearTimeout(timer)}
};
