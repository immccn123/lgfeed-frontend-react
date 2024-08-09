import { useEffect, useRef, useState } from "react";
import {
  Button,
  ButtonGroup,
  Form,
  Icon,
  Input,
  Segment,
} from "semantic-ui-react";
import { api } from "~/utils/api";
import showNotification from "~/utils/notify";
import cytoscape from "cytoscape";
import { SegmentLoader } from "~/components/loader";
import { ClientOnly } from "remix-utils/client-only";
import { download } from "~/utils/download";
import { AxiosError } from "axios";

interface DataResponse {
  benbenCnt: number;
  cacheHit: boolean;
  result: {
    uid: number;
    weight: number;
  }[];
}

/**
 * @param r 第 rn 个圆的半径
 * @param rn 圆的编号
 * @param n 点的编号，逆时针起编，0 开始
 */
function intersect(r: number, rn: number, n: number) {
  let qn = Math.pow(2, rn + 2);
  let deg = (2 * Math.PI) / qn;
  let xi = Math.cos(n * deg) * r,
    yi = Math.sin(n * deg) * r,
    xi1 = Math.cos((n + 1) * deg) * r,
    yi1 = Math.sin((n + 1) * deg) * r;
  let x = (xi + xi1) / 2,
    y = (yi + yi1) / 2,
    rr = Math.sqrt(Math.pow(xi - xi1, 2) + Math.pow(yi - yi1, 2));
  return { x, y, rr: rr * 0.85 };
}

const rn = [20, 33, 43, 50, 55];

const offsetX = 100,
  offsetY = 250;
function getPos(index: number) {
  function transform({ x, y, rr }: { [p: string]: number }) {
    return { x: x * 100 + offsetX, y: y * 100 + offsetY, rr: rr * 100 };
  }
  // rn = 1 时 n = 0..8
  // rn = 2 时 n = 0..16 累计 8..24
  // rn = 3 时 n = 0..32 累计 24..56
  // rn = 4 时 n = 0..64 累计 24..56
  if (0 <= index && index < 8) {
    return transform(intersect(rn[0], 1, index));
  } else if (8 <= index && index < 24) {
    return transform(intersect(rn[1], 2, index - 8));
  } else if (24 <= index && index < 56) {
    return transform(intersect(rn[2], 3, index - 24));
  } else if (56 <= index && index < 56 + 64) {
    return transform(intersect(rn[3], 4, index - 56));
  } else {
    return transform(intersect(rn[4], 5, index - (56 + 64)));
  }
}

const BenbenCircle = () => {
  const [uid, setUid] = useState<number | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DataResponse>();

  const getData = () => {
    setData(undefined);
    setIsLoading(true);
    api
      .get<DataResponse>(`/tools/circle/${uid}`, {
        timeout: 120 * 1000,
      })
      .then((x) => {
        let data = x.data;
        // >2 就是本人主动提起过的
        data.result = data.result.filter((x) => x.weight > 2);
        setData(data);
      })
      .catch((e) => {
        if (e instanceof AxiosError) {
          if (e.response?.status === 524)
            return showNotification(
              "获取数据超时啦 TAT，但是不要着急~ 请务必等两分钟再试试！",
              "error",
            );
        }
        showNotification("在获取数据时出现错误：" + String(e), "error");
      })
      .finally(() => setIsLoading(false));
  };

  const cyHtmlElement = useRef<HTMLDivElement>(null);
  const cy = useRef<cytoscape.Core>();
  const originalZoom = useRef<number>();

  useEffect(() => {
    if (!data) {
      return;
    }

    cy.current = cytoscape({
      container: cyHtmlElement.current,
      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            "background-fit": "cover",
          },
        },
        {
          selector: `node[id = "${uid}"]`,
          style: {
            "background-image": `url(${`https://cdn.luogu.com.cn/upload/usericon/${uid}.png`})`,
            height: 1600,
            width: 1600,
            "border-width": 50,
            "border-color": "pink",
          },
        },
        ...data.result.map((x, i) => ({
          selector: `node[id = "${x.uid}"]`,
          style: {
            "background-image": `url(https://cdn.luogu.com.cn/upload/usericon/${x.uid}.png)`,
            height: getPos(i).rr,
            width: getPos(i).rr,
          },
        })),
      ],
      elements: [
        {
          group: "nodes",
          data: {
            id: uid?.toString(),
            label: uid?.toString(),
          },
          renderedPosition: { x: offsetX, y: offsetY },
        },
        ...data.result.map((x, i) => ({
          group: "nodes" as "nodes",
          data: {
            id: x.uid.toString(),
            label: x.uid.toString(),
            weight: x.weight,
          },
          position: getPos(i),
        })),
      ],
      layout: { name: "preset" },
    });

    originalZoom.current = cy.current.zoom();

    return () => {
      cy.current?.destroy();
      originalZoom.current = undefined;
    };
  }, [data]);

  function reset() {
    cy.current?.center();
    cy.current?.zoom(originalZoom.current);
  }

  return (
    <div>
      <div>
        <h1>Benben Circle</h1>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            getData();
          }}
        >
          <Input
            action={
              <Button
                disabled={uid === null || isLoading}
                loading={isLoading}
                type="submit"
              >
                分析一下！
              </Button>
            }
            onChange={(_, { value }) => setUid(parseInt(value))}
            value={uid}
            placeholder="UID..."
            type="number"
            min={1}
            max={10000000}
          />
        </Form>
      </div>
      {isLoading && (
        <Segment>
          <SegmentLoader>
            稍候就好。此过程根据用户热度和缓存情况，时长在 10s ~ 120s 不等。
            <br />
            <strong>
              如果这段时间实在是因为超时导致获取数据失败，为了缓解服务器压力，请等待三分钟之后再重试，因为这个时候缓存应该已经建立。
            </strong>
          </SegmentLoader>
        </Segment>
      )}
      {data && (
        <>
          <Segment>
            <p>
              共分析了 {data.benbenCnt} 条相关犇犇。
              {data.cacheHit
                ? "这是缓存的结果，缓存有效期自第一次查询起有 8 小时。" +
                  "当然中间也可能因为算法微调而清空缓存，不过这就很玄学了。"
                : "结果已缓存。"}
            </p>
            <div
              id="canvas"
              ref={cyHtmlElement}
              style={{
                width: "100%",
                height: 500,
              }}
            ></div>
            <div style={{ textAlign: "center" }}>
              <ButtonGroup>
                <Button onClick={reset}>
                  <Icon name="history" />
                  重置
                </Button>
                <Button
                  onClick={() => {
                    reset();
                    download(
                      cy.current?.png({
                        bg: "lightblue",
                        maxWidth: 500,
                        maxHeight: 500,
                      })!,
                      `${uid}-circle.png`,
                    );
                  }}
                >
                  <Icon name="download" />
                  保存图片
                </Button>
              </ButtonGroup>
            </div>
          </Segment>
          <br />
          有奖竞猜：判断互动用户的算法是什么。找到了你认为正确的算法（含参数）发送邮件到
          me[at]imken.moe，有惊喜大奖（
        </>
      )}
    </div>
  );
};

export default function Wrapper() {
  return <ClientOnly>{() => <BenbenCircle />}</ClientOnly>;
}
