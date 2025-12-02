import { useEffect, useRef, useState } from "preact/hooks";

import { Slider } from "../../components/Slider";

import data from "../../data.yml";
import colors from "../../colors.yml";

import "./style.css";
import { Button } from "../../components/Button";
import { Application, Assets, Sprite, Text } from "pixi.js";
import { Modal } from "../../components/Modal";
import type { JSX } from "preact/jsx-runtime";

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
  const [lineSpacing, setLineSpacing] = useState(1);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [textColor, setTextColor] = useState("#000000");

  const [stickerPickerVisible, setStickerPickerVisible] = useState(false);

  const [characterName, setCharacterName] = useState("Klee");
  const [characterNum, setCharacterNum] = useState("1");

  useEffect(() => {
    const chars = Object.entries(data).filter(
      ([char]) => !["hilichurl", "others"].includes(char)
    );
    const [id, { preview: n, color }] =
      chars[Math.floor(Math.random() * chars.length)];
    setCharacterName(id);
    setCharacterNum(n);
    setTextColor(colors[color]);
  }, []);

  return (
    <>
      <div class={"flex flex-col gap-8"}>
        <div
          class={"flex flex-col items-center gap-8 sm:flex-row sm:items-start"}
        >
          <div class={"grid grid-cols-[2fr_2em] grid-rows-[2fr_2em]"}>
            <Preview
              characterName={characterName}
              characterNum={characterNum}
              textContent={textContent}
              textSize={fontSize}
              textRotation={rotation}
              textX={x}
              textY={y}
              textLineSpacing={lineSpacing}
              textLetterSpacing={letterSpacing}
              textColor={textColor}
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

            <p class={"mt-4"}>Line spacing</p>
            <Slider
              value={lineSpacing}
              min={0.1}
              max={20}
              onChange={(v) => setLineSpacing(v)}
            />

            <p class={"mt-4"}>Letter spacing</p>
            <Slider
              value={letterSpacing}
              min={-0.5}
              max={1}
              onChange={(v) => setLetterSpacing(v)}
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
          <Button type="change" onClick={() => setStickerPickerVisible(true)}>
            <span>Change character</span>
          </Button>
          <Button
            type="confirm"
            onClick={() => window.dispatchEvent(new Event("download-sticker"))}
          >
            <span>Download sticker</span>
          </Button>
        </div>
      </div>
      <StickerPicker
        visible={stickerPickerVisible}
        setVisible={setStickerPickerVisible}
        onChange={({ name, num, color }) => {
          setCharacterName(name);
          setCharacterNum(num);
          console.log(color, colors);
          setTextColor(colors[color]);
        }}
      />
    </>
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
  textLineSpacing,
  textLetterSpacing,
  textColor,
}: {
  characterName: string;
  characterNum: string;
  textContent: string;
  textSize: number;
  textRotation: number;
  textX: number;
  textY: number;
  textLineSpacing: number;
  textLetterSpacing: number;
  textColor: string;
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
          lineHeight: textLineSpacing * textSize,
          letterSpacing: textLetterSpacing * textSize,
          fill: textColor,
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
    text.style.lineHeight = textLineSpacing * textSize;
    text.style.letterSpacing = textLetterSpacing * textSize;
    text.style.fill = textColor;
  }, [
    ready,
    text,
    textContent,
    textSize,
    textRotation,
    textX,
    textY,
    textLineSpacing,
    textLetterSpacing,
    textColor,
  ]);

  useEffect(() => {
    const cb = () => {
      if (!app?.renderer?.extract) return;
      app.renderer.extract.download({
        target: app.stage,
        filename: `${characterName}${characterNum}_${Date.now()}.png`,
      });
    };
    window.addEventListener("download-sticker", cb);
    return () => {
      window.removeEventListener("download-sticker", cb);
    };
  }, [characterName, characterNum]);

  return (
    <div
      ref={appContainer}
      class={"bg-darker *:w-full *:h-full h-64 w-64 rounded-xl"}
    ></div>
  );
}

function StickerPicker({
  visible,
  setVisible,
  onChange,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onChange: (data: any) => void;
}) {
  const [showingCharList, setShowingCharList] = useState(true);
  const [selectedChar, setSelectedChar] = useState("");

  useEffect(() => {
    if (visible) {
      setShowingCharList(true);
      setSelectedChar("");
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      onClose={() => setVisible(false)}
      title="Select character"
    >
      <>
        {/* list of characters */}
        <StickerList visible={showingCharList}>
          <>
            {Object.entries(data).map(([id, { name, preview }]) => (
              <StickerListTile
                img={`${RESOURCE_BASE_URL}/${id}/${preview}.png`}
                label={name}
                onClick={() => {
                  setShowingCharList(false);
                  setSelectedChar(id);
                }}
              />
            ))}
          </>
        </StickerList>
        {/* list of stickers for a character */}
        <StickerList visible={!showingCharList}>
          <>
            {selectedChar &&
              Array.from({ length: data[selectedChar].count }).map((_, i) => (
                <StickerListTile
                  key={`${selectedChar}${i}`}
                  img={`${RESOURCE_BASE_URL}/${selectedChar}/${i + 1}.png`}
                  label={`${data[selectedChar].name} ${i + 1}`}
                  onClick={() => {
                    onChange({
                      name: data[selectedChar].name,
                      num: i + 1,
                      color: data[selectedChar].color,
                    });
                    setVisible(false);
                  }}
                />
              ))}
          </>
        </StickerList>
      </>
    </Modal>
  );
}
function StickerList({
  children,
  visible,
}: {
  children: JSX.Element;
  visible: boolean;
}) {
  return (
    <div
      class={
        "grid grid-cols-3 gap-1 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
      }
      style={{
        display: visible ? "" : "none",
      }}
    >
      {children}
    </div>
  );
}
function StickerListTile({
  img,
  label,
  onClick,
}: {
  img: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      class={
        "hover:bg-darker flex aspect-square cursor-pointer rounded-lg w-28 sm:w-32 flex-col items-center gap-1.5 justify-center"
      }
      onClick={onClick}
    >
      <div class={"flex h-20 w-20 items-center justify-center"}>
        <img class={"h-auto w-20"} src={img} loading={"lazy"} />
      </div>
      <span class={"text-center leading-none"}>{label}</span>
    </button>
  );
}
