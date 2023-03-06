import { create } from "random-seed";
import source from "./base64.json";

const colors = {
  skin: ['#f5ba81'],
  hair: [
    '#2f2e2b',
    '#23201b',
    '#171410',
    '#090806',
    '#2C222B',
    '#71635A',
    '#A56B46',
    '#B55239',
    '#91553D',
    '#533D32',
    '#3B3024',
    '#554838',
    '#4E433F',
    '#504444',
    '#6A4E42',
  ],
  shirt: ['#ffffff', '#e1e1e1', '#1f1f1f', '#000000'],
  top: [
    '#6F1E51',
    '#833471',
    '#B53471',
    '#ED4C67',
    '#5758BB',
    '#9980FA',
    '#D980FA',
    '#FDA7DF',
    '#1B1464',
    '#0652DD',
    '#1289A7',
    '#12CBC4',
    '#006266',
    '#009432',
    '#A3CB38',
    '#C4E538',
    '#EA2027',
    '#EE5A24',
    '#F79F1F',
    '#FFC312',
  ],
}

const backgroundGradients = [
  ['#09d2ff', '#ceeff7'],
  ['#1b9e96', '#cdf7f5'],
  ['#b33c96', '#e2b0d6'],
  ['#ccd362', '#e9ecb7'],
  ['#b1ee6f', '#d6f2b8']
];

const layers = {
  'body/body': 'skin',
  'body/shadow': null,
  'clothes/shirts/shirt': 'shirt',
  'clothes/tops/vest': 'top',
  'head/head': 'skin',
  'head/eyes': null,
  'head/mouth': null,
  'head/hair_female': 'hair',
  'head/hair_male': 'hair',
  'head/beard': 'hair',
  'head/addons': null,
};

const genderDepend = {
  'head/hair_male': 1,
  'head/beard': 1,
  'head/hair_female': 2,
};

const optional = {
  'head/beard': 80, // chance per 100
  'head/addons': 30, // chance per 100
}

const size = {
  width: 40,
  height: 40
}

const hexToRgb = (hex: string) : number[] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [];
}

const getAvatar = async (seed: string = "1337", gender: number = 1) => {
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const ctx = canvas.getContext("2d");

  const seededRandom = create(seed);

  const gradientIndex = seededRandom.intBetween(0, backgroundGradients.length - 1);

  const grd = ctx.createLinearGradient(0, 0, 0, size.height);
  grd.addColorStop(0, backgroundGradients[gradientIndex][1]);
  grd.addColorStop(1, backgroundGradients[gradientIndex][0]);

  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, size.width, size.height);

  const addBase64 = async (base64: any, color: number[]) => {
    const image = new Image();

    image.src = `data:image/png;base64,${base64}`;
    await image.decode();

    const bufferCanvas = document.createElement("canvas");
    bufferCanvas.width = canvas.width;
    bufferCanvas.height = canvas.width;
    const bufferCtx = bufferCanvas.getContext("2d");

    bufferCtx.drawImage(image, 0, 0);

    if (color.length) {
      let imgData = bufferCtx.getImageData(0, 0, bufferCanvas.width, bufferCanvas.height);
      let data = imgData.data;

      for (let i = 0; i < data.length; i += 4) 
      {
        if (data[i+3] != 0) {
          data[i] = color[0];
          data[i+1] = color[1];
          data[i+2] = color[2];
        }
      }
      
      bufferCtx.putImageData(imgData, 0, 0);
    }

    ctx.drawImage(bufferCanvas, 0, 0);
  };

  let randomizedColors:any = {};
  Object.entries(colors).forEach(([key, val]) => {
    randomizedColors[key] = hexToRgb(val[seededRandom.intBetween(0, val.length)]);
  });

  const layersEntries = Object.entries(layers);
  for (let index = 0; index < layersEntries.length; index++) {
    const [key, val] = layersEntries[index];

    if (
      !(key in genderDepend && genderDepend[key as keyof typeof genderDepend] != gender) &&
      !(key in optional && optional[key as keyof typeof optional] < seededRandom.intBetween(1, 100))
    ) {
      let base64: any = source;
      key.split("/").forEach((literal) => {
        base64 = base64[literal as keyof typeof base64];
      });

      if (typeof base64 == "object") {
        const keys: string[] = Object.keys(base64);
        base64 = base64[keys[seededRandom.intBetween(0, keys.length - 1)]];
      }

      if (val && (val in colors)) {
        await addBase64(base64, randomizedColors[val]);
      } else {
        await addBase64(base64, []);
      }
    }
  };

  return canvas.toDataURL();
};

export default getAvatar;
