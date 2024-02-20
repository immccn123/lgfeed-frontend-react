// 不想重构这一坨初学 React 写的史了。
// 为什么当时我要开历史倒车写 类组件。
// 纯纯想不开。

import React, { useEffect, useState } from "react";
import { Location, useLocation, useNavigate } from "@remix-run/react";
import { Button, Feed, Segment, Form, Message, Icon } from "semantic-ui-react";
import { Benben } from "~/components/feed";
import { CachedResponse, BenbenItem as BenbenItem } from "~/interfaces";
import { api } from "~/utils/api";
import { SegmentLoader } from "~/components/loader";
import { AxiosResponse } from "axios";

interface SearchPageProps {
  navigate: (to: string) => void;
  location: Location;
}

const SearchPage: React.FC<SearchPageProps> = ({ navigate, location }) => {
  const queryParams = new URLSearchParams(location.search);

  const [keyword, setKeyword] = useState<string | null>(
    queryParams.get("keyword"),
  );
  const [senderText, setSenderText] = useState<string | null>(
    queryParams.getAll("sender").join(","),
  );
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<BenbenItem[]>([]);
  const [noMoreContent, setNoMoreContent] = useState(false);
  // const [dateBefore, setDateBefore] = useState<Date>();
  // const [dateAfter, setDateAfter] = useState<Date>();

  const getSender = (senderText: string) =>
    senderText.split(",").map((x) => parseInt(x.trim()));

  const getParams = () => {
    let params: string[] = [];

    if (keyword) params.push(`keyword=${encodeURIComponent(keyword)}`);
    if (senderText)
      getSender(senderText).forEach((value) => params.push(`sender=${value}`));

    return params;
  };

  const handleSearch = () => navigate(`/search?` + getParams().join("&"));

  const loadMore = () => {
    setLoading(true);
    let params = getParams();
    if (results.length !== 0)
      params.push(`id_before=${results.slice(-1)[0].id}`);

    const apiUrl = `/tools/search?` + params.join("&");
    console.log(apiUrl);

    api
      .get<CachedResponse<BenbenItem[]>>(apiUrl)
      .then((resp: AxiosResponse<CachedResponse<BenbenItem[]>>) => {
        if (resp.data.content.length < 50) setNoMoreContent(true);
        setResults(results.concat(resp.data.content));
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <div>
      <h1>犇犇检索</h1>
      <div>
        <div>
          <Form>
            <Form.Group widths="equal">
              <Form.Input
                fluid
                placeholder="AK IOI"
                icon="search"
                iconPosition="left"
                label="关键词（大小写不敏感）"
                value={keyword}
                onChange={(_, { value }) => setKeyword(value)}
              />
              <Form.Input
                placeholder="半角逗号分隔，如 1,385633"
                icon="user"
                iconPosition="left"
                label="发送人 UID"
                value={senderText}
                onChange={(_, { value }) => setSenderText(value)}
              />
            </Form.Group>
            <Button onClick={handleSearch} icon labelPosition="left">
              <Icon name="search" />
              Search
            </Button>
          </Form>
        </div>
        {/* <Input
            placeholder="Date After"
            value={dateAfter?.toISOString() ?? ""}
            onChange={(_, { value }) =>
              this.setState({ dateAfter: new Date(value) })
            }
          />
          <Input
            placeholder="Date Before"
            value={dateBefore?.toISOString() ?? ""}
            onChange={(_, { value }) =>
              this.setState({ dateBefore: new Date(value) })
            }
          /> */}
      </div>
      <div style={{ paddingTop: "20px" }}>
        <Feed>
          {results.map((value) => (
            <Benben data={value} />
          ))}
        </Feed>
        {loading ? (
          <Segment>
            <SegmentLoader />
          </Segment>
        ) : noMoreContent || results.length === 0 ? (
          <Message
            header="没有更多内容啦"
            content="之后就什么也没有了哦"
          ></Message>
        ) : (
          <Button
            fluid
            onClick={loadMore}
            disabled={loading}
            style={{ marginTop: "10px" }}
          >
            <Icon name="chevron down" />
            加载更多
          </Button>
        )}
      </div>
    </div>
  );
};

export default function SearchPageWrapper() {
  const location = useLocation();
  return (
    <SearchPage
      navigate={useNavigate()}
      location={location}
      key={location.search}
    />
  );
}
