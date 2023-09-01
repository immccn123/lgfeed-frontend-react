import React from "react";
import { Location, useLocation, useNavigate } from "@remix-run/react";
import { Button, Feed, Segment, Form } from "semantic-ui-react";
import { SingleFeed } from "~/components/feed";
import { CachedResponse, SingleFeedItem } from "~/interfaces";
import { api } from "~/utils/api";
import { SegmentLoader } from "~/components/loader";

interface SearchPageProps {
  navigate: (to: string) => void;
  location: Location;
}

interface SearchPageState {
  keyword?: string;
  sender?: number[];
  senderText?: string;
  dateAfter?: Date;
  dateBefore?: Date;
  loading: boolean;
  results: SingleFeedItem[];
}

class SearchPage extends React.Component<SearchPageProps, SearchPageState> {
  constructor(props: SearchPageProps) {
    super(props);
    this.state = {
      keyword: "",
      sender: [],
      loading: false,
      results: [],
    };
  }

  componentDidMount() {
    this.parseQueryParams();
  }

  componentDidUpdate(prevProps: SearchPageProps, prevState: SearchPageState) {
    if (this.props.location.search !== prevProps.location.search) {
      this.parseQueryParams();
    }
    if (prevState.senderText !== this.state.senderText) {
      this.setState({
        sender:
          this.state.senderText?.split(",").map((value) => parseInt(value)) ||
          [],
      });
    }
  }

  parseQueryParams() {
    const queryParams = new URLSearchParams(this.props.location.search);
    const keywordParam = queryParams.get("keyword");
    const senderParam = queryParams.getAll("sender");
    // const dateAfterParam = queryParams.get("date_after");
    // const dateBeforeParam = queryParams.get("date_before");

    this.setState(
      {
        keyword: keywordParam || "",
        senderText: senderParam.join(","),
        sender: senderParam.map((value) => parseInt(value)),
        // dateAfter: new Date(dateAfterParam || 0),
        // dateBefore: new Date(dateBeforeParam || 0),
      },
      () => {
        this.performSearch();
      },
    );
  }

  async performSearch() {
    this.setState({ loading: true });

    const { keyword, sender, dateAfter, dateBefore } = this.state;

    let params: string[] = [];
    if (keyword) params.push(`keyword=${keyword}`);
    if (sender) sender.map((value) => params.push(`senders=${value}`));
    if (dateAfter) params.push(`date_after=${dateAfter.toISOString()}`);
    if (dateBefore) params.push(`date_before=${dateBefore.toISOString()}`);

    const apiUrl = `/tools/search?` + params.join("&");

    try {
      const response = await api.get<CachedResponse<SingleFeedItem[]>>(apiUrl);
      this.setState({ results: response.data.content });
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      this.setState({ loading: false });
    }
  }

  handleSearch = () => {
    const { keyword, sender, dateAfter, dateBefore } = this.state;
    let params: string[] = [];

    if (keyword) params.push(`keyword=${keyword}`);
    if (sender) sender.map((value) => params.push(`sender=${value}`));
    if (dateAfter) params.push(`date_after=${dateAfter}`);
    if (dateBefore) params.push(`date_before=${dateBefore}`);

    const searchUrl = `/search?` + params.join("&");

    this.props.navigate(searchUrl);
  };

  render() {
    const { keyword, senderText, dateAfter, dateBefore, loading, results } =
      this.state;

    return (
      <div>
        <h1>犇犇检索</h1>
        <div>
          <Segment>
            <Form>
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  placeholder="AK IOI"
                  label="关键词（大小写不敏感）"
                  value={keyword}
                  onChange={(_, { value }) => this.setState({ keyword: value })}
                />
                <Form.Input
                  placeholder="半角逗号分隔，如 1,385633"
                  label="发送人 UID"
                  value={senderText}
                  onChange={(_, { value }) =>
                    this.setState({ senderText: value })
                  }
                />
              </Form.Group>
              <Button primary onClick={this.handleSearch}>
                Search
              </Button>
            </Form>
          </Segment>
          {/* <Input
            placeholder="Date After"
            value={dateAfter?.toISOString() || ""}
            onChange={(_, { value }) =>
              this.setState({ dateAfter: new Date(value) })
            }
          />
          <Input
            placeholder="Date Before"
            value={dateBefore?.toISOString() || ""}
            onChange={(_, { value }) =>
              this.setState({ dateBefore: new Date(value) })
            }
          /> */}
        </div>
        <Segment>
          <Feed>
            {results.map((value) => (
              <SingleFeed data={value} />
            ))}
          </Feed>
          {loading ? (
            <SegmentLoader />
          ) : (
            <Button
              primary
              onClick={() => {
                this.performSearch();
              }}
              disabled={loading}
              style={{ marginTop: "10px" }}
            >
              Load More (Not Impl Yet)
            </Button>
          )}
        </Segment>
        {/* */}
      </div>
    );
  }
}

export default function SearchPageWrapper() {
  return <SearchPage navigate={useNavigate()} location={useLocation()} />;
}
