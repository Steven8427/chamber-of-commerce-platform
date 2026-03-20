export const mkAv = (name, hue = 210) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'>
      <rect width='80' height='80' rx='40' fill='hsl(${hue},55%,30%)'/>
      <text x='40' y='52' font-size='26' fill='rgba(255,255,255,.9)' text-anchor='middle' font-family='serif'>${name.slice(0, 2)}</text>
    </svg>`
  )}`;

export const MOCK_SETTINGS = {
  orgName: "开封市示范区城西商会",
  orgLogo: "",
  orgSubtitle: "诚挚邀请",
};
