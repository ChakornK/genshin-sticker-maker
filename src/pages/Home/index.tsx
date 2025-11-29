import { useEffect, useRef, useState } from "preact/hooks";

import { Slider } from "../../components/Slider";

import data from "../../data.yml";

import "./style.css";
import { Button } from "../../components/Button";
import { Application, Assets, Sprite, Text } from "pixi.js";

const RESOURCE_BASE_URL =
  "https://cdn.jsdelivr.net/gh/ChakornK/genshin-sticker-maker/assets";

export function Home() {
  return (
    <main className={"flex h-full flex-col items-center gap-8 p-8"}>
      <h1 class={"text-center text-4xl sm:text-6xl"}>Genshin Sticker Maker</h1>
      <div class={"w-full max-w-2xl grow"}>
        <Editor />
      </div>
    </main>
  );
}

function Editor() {
  const [x, setX] = useState(50);
  const [y, setY] = useState(15);
  const [rotation, setRotation] = useState(0);
  const [fontSize, setFontSize] = useState(36);
  const [textContent, setTextContent] = useState("Hello!");

  return (
    <div class={"flex flex-col gap-8"}>
      <div
        class={"flex flex-col items-center gap-8 sm:flex-row sm:items-start"}
      >
        <div class={"grid grid-cols-[2fr_2em] grid-rows-[2fr_2em]"}>
          <Preview
            characterName="Klee"
            characterNum="1"
            textContent={textContent}
            textSize={fontSize}
            textRotation={rotation}
            textX={x}
            textY={y}
          />
          <Slider
            vertical
            value={y}
            min={0}
            max={100}
            onChange={(v) => setY(v)}
          />
          <Slider value={x} min={0} max={100} onChange={(v) => setX(v)} />
        </div>
        <div
          class={
            "max-w-2xs flex w-full grow flex-col items-stretch sm:max-w-full"
          }
        >
          <p>Rotation</p>
          <Slider
            value={rotation}
            min={-180}
            max={180}
            onChange={(v) => setRotation(v)}
          />

          <p class={"mt-4"}>Font size</p>
          <Slider
            value={fontSize}
            min={12}
            max={96}
            onChange={(v) => setFontSize(v)}
          />

          <p class={"mt-4"}>Text</p>
          <textarea
            class={"mt-2 rounded-lg bg-black/30 p-2"}
            value={textContent}
            onInput={(e) =>
              setTextContent((e.target as HTMLTextAreaElement).value)
            }
          />
        </div>
      </div>
      <div
        class={
          "flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8"
        }
      >
        <Button type="change" onClick={() => {}}>
          <span>Change character</span>
        </Button>
        <Button type="confirm" onClick={() => {}}>
          <span>Download sticker</span>
        </Button>
      </div>
    </div>
  );
}

function Preview({
  characterName,
  characterNum,
  textContent,
  textSize,
  textRotation,
  textX,
  textY,
}: {
  characterName: string;
  characterNum: string;
  textContent: string;
  textSize: number;
  textRotation: number;
  textX: number;
  textY: number;
}) {
  const [ready, setReady] = useState(false);
  const [app] = useState(new Application());
  const appContainer = useRef<HTMLDivElement>(null);

  const [sprite, setSprite] = useState<Sprite>(null);
  const [text, setText] = useState<Text>(null);

  useEffect(() => {
    (async () => {
      if (document.getElementById("preview-canvas")) return;

      await app.init({
        resizeTo: appContainer.current!,
        antialias: true,
        webgl: {
          antialias: true,
        },
        backgroundColor: 0x000000,
        backgroundAlpha: 0,
        resolution: 2,
      });
      app.canvas.id = "preview-canvas";
      appContainer.current!.appendChild(app.canvas);

      const s = new Sprite({
        anchor: { x: 0.5, y: 0.5 },
        width: app.screen.width,
        height: app.screen.height,
        x: app.screen.width / 2,
        y: app.screen.height / 2,
      });
      app.stage.addChild(s);

      await Assets.load({
        src: `${RESOURCE_BASE_URL}/YurukaStd.woff2`,
        data: { family: "Yuruka" },
      });
      const t = new Text({
        anchor: { x: 0.5, y: 0.5 },
        angle: textRotation,
        style: {
          fontFamily: "Yuruka",
          fontSize: textSize,
          align: "center",
          stroke: {
            color: 0xffffff,
            width: 8,
          },
        },
        text: textContent,
        x: (textX / 100) * app.screen.width,
        y: (textY / 100) * app.screen.height,
      });
      app.stage.addChild(t);

      setSprite(s);
      setText(t);
      setReady(true);
    })();

    return () => {
      try {
        app.destroy(true);
      } catch {}
    };
  }, []);

  useEffect(() => {
    (async () => {
      if (!ready || !sprite) return;
      const tex = await Assets.load(
        `${RESOURCE_BASE_URL}/${characterName.toLowerCase()}/${characterNum}.png`
      );
      sprite.texture = tex;
    })();
  }, [ready, sprite, characterName, characterNum]);

  useEffect(() => {
    if (!ready || !text) return;
    text.text = textContent;
    text.style.fontSize = textSize;
    text.angle = textRotation;
    text.x = (textX / 100) * app.screen.width;
    text.y = (textY / 100) * app.screen.height;
  }, [ready, text, textContent, textSize, textRotation, textX, textY]);

  return (
    <div
      ref={appContainer}
      class={"bg-darker *:w-full *:h-full h-64 w-64 rounded-xl"}
    ></div>
  );
}
