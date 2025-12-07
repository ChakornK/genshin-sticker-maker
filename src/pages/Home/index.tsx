import { useEffect, useRef, useState } from "preact/hooks";

import { Slider } from "../../components/Slider";

import data from "../../data.yml";
import colors from "../../colors.yml";

import "./style.css";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import type { JSX } from "preact/jsx-runtime";

import { Stage as KonvaStage } from "konva/lib/Stage";
import { Image as KonvaImage } from "konva/lib/shapes/Image";
import { Text as KonvaText } from "konva/lib/shapes/Text";
import { Layer as KonvaLayer } from "konva/lib/Layer";

const RESOURCE_BASE_URL = import.meta.env.VITE_RESOURCE_BASE_URL || "assets";

export function Home() {
  return (
    <main
      className={
        "flex min-h-full flex-col items-center justify-between gap-16 p-8"
      }
    >
      <div class={"flex flex-col items-center gap-8"}>
        <h1 class={"text-center text-4xl sm:text-6xl"}>
          Genshin Sticker Maker
        </h1>
        <div class={"w-full max-w-2xl grow"}>
          <Editor />
        </div>
      </div>
      <a
        href={`https://github.com/ChakornK/genshin-sticker-maker?utm_source=${
          location.host || ""
        }`}
        target={"_blank"}
        class={"hover:text-accent underline"}
      >
        Source code
      </a>
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
      <div class={"flex flex-col gap-4"}>
        <div
          class={
            "sm:*:w-1/2 *:w-full flex flex-col items-center gap-8 sm:flex-row sm:items-start"
          }
        >
          <div>
            <div
              class={
                "mx-auto grid w-[fit-content_!important] grid-cols-[2fr_2em] grid-rows-[2fr_2em]"
              }
            >
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
          </div>
          <div class={"max-w-2xs flex flex-col items-stretch sm:max-w-full"}>
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
          </div>
        </div>
        <div
          class={
            "sm:*:w-1/2 w-full *:max-w-2xs sm:*:max-w-full flex flex-col items-center gap-8 sm:flex-row-reverse sm:items-start *:flex *:flex-col *:items-stretch"
          }
        >
          <div>
            <p>Text</p>
            <textarea
              class={"mt-2 rounded-lg bg-black/30 p-2"}
              value={textContent}
              onInput={(e) =>
                setTextContent((e.target as HTMLTextAreaElement).value)
              }
            />
          </div>

          <div>
            <p class={"mb-2"}>Text color</p>
            <ColorPicker onChange={(color) => setTextColor(color)} />
          </div>
        </div>
        <div
          class={
            "flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8 mt-4"
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
          setTextColor(color);
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
  const [stage, setStage] = useState<KonvaStage>(null);
  const appContainer = useRef<HTMLDivElement>(null);

  const [sprite, setSprite] = useState<KonvaImage>(null);
  const [text, setText] = useState<KonvaText>(null);

  useEffect(() => {
    (async () => {
      const stage = new KonvaStage({
        container: appContainer.current!,
        width: appContainer.current!.clientWidth,
        height: appContainer.current!.clientHeight,
        backgroundAlpha: 0,
        listening: false,
      });
      stage.listening(false);
      setStage(stage);

      const layer = new KonvaLayer({
        listening: false,
      });
      stage.add(layer);

      const s = new KonvaImage({
        x: 0,
        y: 0,
        width: stage.width(),
        height: stage.height(),
        image: null,
      });

      if (!document.getElementById("yuruka-font-face")) {
        const css = document.createElement("style");
        css.id = "yuruka-font-face";
        css.innerHTML = `@font-face {
          font-family: 'Yuruka';
          src: url('${RESOURCE_BASE_URL}/YurukaStd.woff2') format('truetype');
        }`;
        document.head.appendChild(css);
      }
      if (!document.fonts.check("12px Yuruka")) {
        await document.fonts.load("12px Yuruka");
      }

      const t = new KonvaText({
        fontFamily: "Yuruka",
        align: "center",
        verticalAlign: "middle",
        stroke: "#ffffff",
        strokeWidth: 8,
        fillAfterStrokeEnabled: true,
      });

      layer.add(s, t);

      setSprite(s);
      setText(t);
      setReady(true);
    })();

    return () => {
      try {
        stage.destroy();
      } catch {}
    };
  }, []);

  useEffect(() => {
    (async () => {
      if (!ready || !sprite) return;
      const img = new Image();
      img.onload = () => {
        sprite.setAttr("image", img);
      };
      img.crossOrigin = "anonymous";
      img.src = `${RESOURCE_BASE_URL}/${characterName.toLowerCase()}/${characterNum}.png`;
    })();
  }, [ready, sprite, characterName, characterNum]);

  useEffect(() => {
    if (!ready || !text) return;
    text.setAttrs({
      x: (textX / 100) * stage.width(),
      y: (textY / 100) * stage.height(),
      text: textContent,
      rotation: textRotation,
      fontSize: textSize,
      lineHeight: textLineSpacing,
      letterSpacing: textLetterSpacing * textSize,
      fill: textColor,
    });
    text.offsetX(text.width() / 2);
    text.offsetY(text.height() / 2);
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
      stage.toBlob({
        mimeType: "image/png",
        callback(blob) {
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = `${characterName}${characterNum}_${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(a.href);
        },
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
      class={
        "bg-darker *:w-full *:h-full pointer-events-none h-64 w-64 rounded-xl"
      }
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
  onChange: ({
    name,
    num,
    color,
  }: {
    name: string;
    num: string;
    color: string;
  }) => void;
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
                      num: (i + 1).toString(),
                      color: colors[data[selectedChar].color],
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

const getRainbow = () => {
  const r = Object.keys(colors)
    .filter((c) =>
      ["red", "yellow", "green", "teal", "sky", "blue", "purple"].includes(c)
    )
    .map((c) => colors[c]);
  r.push(r[0]);
  return r;
};
function ColorPicker({ onChange }: { onChange: (color: string) => void }) {
  const colorPickerRef = useRef<HTMLInputElement>(null);

  return (
    <div class={"flex flex-wrap gap-2"}>
      {Object.entries(colors).map(([color, hex]) => (
        <button
          class={"aspect-square h-8 w-8 cursor-pointer rounded-full"}
          style={{ backgroundColor: hex }}
          onClick={() => onChange(hex)}
        />
      ))}
      <button
        class={
          "aspect-square h-8 w-8 relative cursor-pointer overflow-hidden rounded-full"
        }
        onClick={() => colorPickerRef.current!.click()}
      >
        <div
          class={"absolute -inset-2"}
          style={{
            filter: "blur(2px)",
            backgroundImage: `conic-gradient(${getRainbow().join(",")})`,
          }}
        ></div>
        <input
          ref={colorPickerRef}
          type="color"
          class={"pointer-events-none"}
          onChange={(e) => onChange((e.target as HTMLInputElement).value)}
        />
      </button>
    </div>
  );
}
