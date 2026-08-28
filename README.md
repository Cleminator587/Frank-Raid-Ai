# Frank RAID KI

## Benötigte Secrets
- OPENAI_API_KEY
- ELEVENLABS_API_KEY

Die Voice-ID ist bereits eingebaut:
Rw36oTna13ciIrVXDKg1

## Deployment
Für diese Version GitHub Pages NICHT verwenden, weil Frank zwei Server-Funktionen braucht.
Am einfachsten: Repository bei GitHub anlegen, Dateien hochladen und das Repo mit Vercel verbinden.
Danach in Vercel unter Project Settings > Environment Variables die beiden Secrets eintragen und neu deployen.

## Dateien
- index.html — iPad-Oberfläche
- api/chat.js — KI + Websuche
- api/tts.js — ElevenLabs Stimme
