const VOICE_ID='Rw36oTna13ciIrVXDKg1';

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'POST required'});
  if(!process.env.ELEVENLABS_API_KEY) return res.status(500).json({error:'ELEVENLABS_API_KEY fehlt'});
  const text=(req.body?.text||'').trim().slice(0,2500);
  if(!text) return res.status(400).json({error:'Kein Text erhalten'});

  try{
    const r=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,{
      method:'POST',
      headers:{
        'xi-api-key':process.env.ELEVENLABS_API_KEY,
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        text,
        model_id:'eleven_multilingual_v2',
        voice_settings:{
          stability:0.45,
          similarity_boost:0.8,
          style:0.2,
          use_speaker_boost:true
        }
      })
    });
    if(!r.ok){
      const t=await r.text();
      return res.status(r.status).json({error:'ElevenLabs: '+t.slice(0,300)});
    }
    const buf=Buffer.from(await r.arrayBuffer());
    res.setHeader('Content-Type','audio/mpeg');
    res.setHeader('Cache-Control','no-store');
    res.status(200).send(buf);
  }catch(err){
    res.status(500).json({error:err.message||'TTS-Fehler'});
  }
}
