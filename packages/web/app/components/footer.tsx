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
        为了提升您的浏览体验并优化我们的网站，我们使用了 Microsoft Clarity
        分析工具。Clarity
        会收集您在网站上的匿名行为数据，帮助我们更好地了解您的需求。欲了解更多信息，参阅{" "}
        <a
          href="https://privacy.microsoft.com/zh-cn/privacystatement"
          target="_blank"
          rel="noopener noreferrer"
        >
          Microsoft 隐私声明
        </a>。
        <br />
        为了向您提供更相关的广告，我们使用 Cookie
        追踪您在我们的网站和其他网站上的浏览行为。Google
        等第三方供应商也会使用这些信息向您展示个性化广告。若您欲退出个性化广告，可访问{" "}
        <a
          href="https://www.google.com/settings/ads"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google 广告设置
        </a>
        或{" "}
        <a
          href="https://www.aboutads.info"
          target="_blank"
          rel="noopener noreferrer"
        >
          About Ads
        </a>{" "}
        进行设置。
        <br />
        使用我们的网站即表示您同意我们、Microsoft、Google
        及第三方供应商可以收集和使用上述的数据。
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
        <div style={{ paddingTop: "20px" }}>
          <CommonAd type="fluid" />
        </div>
      </Container>
      <footer>
        <Divider />
        <FooterLayout left={left} right={right} />
      </footer>
    </>
  );
};
