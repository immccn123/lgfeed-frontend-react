import { Container, Divider } from "semantic-ui-react";
import "./styles/footer.css";
import { FC, ReactNode } from "react";
import CommonAd from "./common_ad";

const FooterLayout: FC<{
  left: ReactNode;
  right: ReactNode;
}> = ({ left, right }) => {
  return (
    <>
      {left}
      {right}
    </>
  );

  // return (
  //   <Grid>
  //     <Grid.Column floated="left" width={6}>
  //       {left}
  //     </Grid.Column>
  //     <Grid.Column
  //       floated={windowWidth && windowWidth < 600 ? "left" : "right"}
  //       width={8}
  //     >
  //       {right}
  //     </Grid.Column>
  //   </Grid>
  // );
};

export const Footer: FC<{
  arcEnv?: string | null;
  disablePoweredBy?: boolean;
}> = ({ arcEnv, disablePoweredBy }) => {
  const runningDays = (
    (new Date().getTime() - new Date("2023/07/01 13:05").getTime()) /
    (1000 * 60 * 60 * 24)
  ).toFixed();

  const poweredBy = disablePoweredBy ? null : arcEnv ? (
    <>
      Powered by <a href="https://aws.amazon.com/lambda">AWS Lambda</a>
    </>
  ) : (
    <>
      Powered by <a href="https://vercel.com">▲Vercel</a>
    </>
  );

  const left = (
    <div style={{ margin: 40 }}>
      <p>
        为了提供更好的用户体验和优化网站性能，我们使用了 Microsoft Clarity
        分析工具。通过使用
        Clarity，我们可以收集有关访问者在我们网站上的交互方式的匿名数据。请查阅
        <a href="https://privacy.microsoft.com/zh-cn/privacystatement">
          {" "}
          Microsoft 隐私声明
        </a>
        了解更多详细信息。使用我们的网站即表示您同意我们和 Microsoft
        可以收集和使用这些数据。
      </p>
      <p>
        Copyright &copy; {new Date().getUTCFullYear()}{" "}
        <a href="https://imken.moe">Imken Luo</a>
      </p>
      <p>
        本站已在随时准备跑路的状态下以极其不稳定的方式运行了 {runningDays} 天
      </p>
    </div>
  );

  const right = (
    <p style={{ textAlign: "right", margin: 40 }}>
      Node Environment: {process.env.NODE_ENV}
      <br />
      {arcEnv ? (
        <>
          Architect Environment: {arcEnv}
          <br />
        </>
      ) : null}
      Built with Semantic UI and React (using Remix Framework)
      <br />
      {poweredBy}
    </p>
  );

  return (
    <>
      <Container>
        <CommonAd />
      </Container>
      <footer>
        <Divider />
        <FooterLayout left={left} right={right} />
      </footer>
    </>
  );
};
