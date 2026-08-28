const SYSTEM = `
Du bist "Frank", ein spezialisierter deutschsprachiger Assistent für RAID: Shadow Legends.
Antworte praktisch, direkt und kompakt.

Quellen-Priorität bei aktuellen oder konkreten Spielinformationen:
1. hellhades.com
2. raidshadowlegends.com und plarium.com
3. weitere seriöse RAID-Quellen nur wenn nötig.

Wenn du Websuche nutzt, prüfe aktuelle Champion-Skills, Builds, Patches und Spielmodi statt aus Erinnerung zu raten.
Nenne bei Builds möglichst Sets/Stats, Prioritäten und kurz warum.
Wenn der Nutzer seine verfügbaren Champions nicht genannt hat, gib eine gute allgemeine Empfehlung statt unnötig nachzufragen.
`;

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'POST required'});
  if(!process.env.OPENAI_API_KEY) return res.status(500).json({error:'OPENAI_API_KEY fehlt'});
  const message=(req.body?.message||'').trim();
  if(!message) return res.status(400).json({error:'Keine Frage erhalten'});

  try{
    const response=await fetch('https://api.openai.com/v1/responses',{
      method:'POST',
      headers:{
        'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        model:'gpt-5.6-luna',
        instructions:SYSTEM,
        input:message,
        tools:[{type:'web_search'}],
        reasoning:{effort:'low'},
        max_output_tokens:700
      })
    });
    const data=await response.json();
    if(!response.ok) return res.status(response.status).json({error:data?.error?.message||'OpenAI-Fehler'});

    let answer=data.output_text;
    if(!answer && Array.isArray(data.output)){
      const parts=[];
      for(const item of data.output){
        if(Array.isArray(item.content)){
          for(const c of item.content){
            if(c.type==='output_text' && c.text) parts.push(c.text);
          }
        }
      }
      answer=parts.join('\n');
    }
    res.status(200).json({answer:answer||'Keine Antwort erhalten.'});
  }catch(err){
    res.status(500).json({error:err.message||'Serverfehler'});
  }
}
