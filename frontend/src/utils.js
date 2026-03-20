     export const mkPhoto = (name, hue = 215) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='100'>
      <defs>
        <linearGradient id='bg' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stop-color='hsl(${hue},65%,28%)'/>
          <stop offset='100%' stop-color='hsl(${hue},60%,18%)'/>
        </linearGradient>
      </defs>
      <rect width='80' height='100' fill='url(#bg)'/>
      <ellipse cx='40' cy='108' rx='32' ry='28' fill='#1a2a3a'/>
      <polygon points='40,72 28,95 40,88 52,95' fill='#1e3248'/>
      <polygon points='40,72 34,82 40,80 46,82' fill='white' opacity='0.9'/>
      <polygon points='40,72 37,85 40,88 43,85' fill='#2255aa'/>
      <ellipse cx='40' cy='46' rx='20' ry='24' fill='hsl(30,45%,72%)'/>
      <ellipse cx='40' cy='26' rx='21' ry='12' fill='hsl(${hue},20%,15%)'/>
      <rect x='19' y='26' width='5' height='12' rx='2' fill='hsl(${hue},20%,15%)'/>
      <rect x='56' y='26' width='5' height='12' rx='2' fill='hsl(${hue},20%,15%)'/>
      <ellipse cx='33' cy='46' rx='3' ry='3.5' fill='white'/>
      <ellipse cx='47' cy='46' rx='3' ry='3.5' fill='white'/>
      <circle cx='33' cy='47' r='2' fill='#1a1a2e'/>
      <circle cx='47' cy='47' r='2' fill='#1a1a2e'/>
      <ellipse cx='40' cy='54' rx='2' ry='2.5' fill='hsl(30,40%,62%)'/>
      <path d='M34 61 Q40 65 46 61' stroke='hsl(30,35%,55%)' stroke-width='1.5' fill='none' stroke-linecap='round'/>
      <text x='40' y='94' font-size='11' fill='rgba(255,255,255,0.85)' text-anchor='middle' font-family='serif' font-weight='bold'>${name.slice(0, 2)}</text>
    </svg>`
  )}`;