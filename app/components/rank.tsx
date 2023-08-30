import { Link } from '@remix-run/react';
import React from 'react';
import { Table, Image } from 'semantic-ui-react';
import { LeaderboardProps } from '~/interfaces';

export const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Rank</Table.HeaderCell>
          <Table.HeaderCell>User</Table.HeaderCell>
          <Table.HeaderCell>Score</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {data.map((item, index) => (
          <Table.Row key={index}>
            <Table.Cell>{index + 1}</Table.Cell>
            <Table.Cell>
              <Image src={`https://cdn.luogu.com.cn/upload/usericon/${item.uid}.png`} avatar />
              <Link to={"/user/" + item.uid.toString()}>{item.name}</Link>
            </Table.Cell>
            <Table.Cell>{item.count}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
