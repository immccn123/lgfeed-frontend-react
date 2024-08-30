import { Location, useLocation, useNavigate } from "@remix-run/react";
import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { Button, Feed, Segment, Form, Message, Icon } from "semantic-ui-react";

import { Benben } from "~/components/feed";
import { SegmentLoader } from "~/components/loader";
import { BenbenItem as BenbenItem } from "~/interfaces";
import { api } from "~/utils/api";

import "react-datepicker/dist/react-datepicker.css";
import { CustomDatePicker } from "~/components/date_picker";

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
    queryParams.getAll("senders").join(","),
  );
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<BenbenItem[]>([]);
  const [noMoreContent, setNoMoreContent] = useState(false);

  const dateBeforeParam = queryParams.get("date_before");
  const dateAfterParam = queryParams.get("date_after");

  const [dateBefore, setDateBefore] = useState<Date | null>(
    dateBeforeParam ? new Date(parseInt(dateBeforeParam)) : null,
  );
  const [dateAfter, setDateAfter] = useState<Date | null>(
    dateAfterParam ? new Date(parseInt(dateAfterParam)) : null,
  );

  const getSender = (senderText: string) =>
    senderText.split(",").map((x) => parseInt(x.trim()));

  const getParams = (isSearch: boolean = false) => {
    const params: string[] = [];

    if (keyword) params.push(`keyword=${encodeURIComponent(keyword)}`);
    if (senderText)
      getSender(senderText).forEach((value) => params.push(`senders=${value}`));
    if (dateBefore)
      params.push(
        `date_before=${encodeURIComponent(
          dateBefore.getTime() * (isSearch ? 1000 : 1),
        )}`,
      );
    if (dateAfter)
      params.push(
        `date_after=${encodeURIComponent(
          dateAfter.getTime() * (isSearch ? 1000 : 1),
        )}`,
      );

    return params;
  };

  const handleSearch = () => navigate(`/search?` + getParams().join("&"));

  const loadMore = () => {
    setLoading(true);
    const params = getParams(true);
    if (results.length !== 0)
      params.push(`id_after=${results.slice(-1)[0].id}`);

    const apiUrl = `/search/db?` + params.join("&");

    api.get<BenbenItem[]>(apiUrl).then((resp: AxiosResponse<BenbenItem[]>) => {
      if (resp.data.length < 50) setNoMoreContent(true);
      setResults(results.concat(resp.data));
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
            <Form.Group widths="equal">
              <Form.Field>
                <label>起始时间（留空不作约束）</label>
                <CustomDatePicker
                  selected={dateAfter}
                  onChange={(date) => setDateAfter(date)}
                />
              </Form.Field>
              <Form.Field>
                <label>终止时间（留空不作约束）</label>
                <CustomDatePicker
                  selected={dateBefore}
                  onChange={(date) => setDateBefore(date)}
                />
              </Form.Field>
            </Form.Group>
            <Button onClick={handleSearch} icon labelPosition="left">
              <Icon name="search" />
              Search
            </Button>
          </Form>
        </div>
      </div>
      <div style={{ paddingTop: "20px" }}>
        <Feed>
          {results.map((value, index) => (
            <Benben
              data={value}
              key={value.id}
              adNext={index !== 0 && index % 15 === 0}
            />
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
