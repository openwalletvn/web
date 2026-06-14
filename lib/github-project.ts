export interface GithubProjectLabel {
    name: string;
    color: string;
}

export interface GithubProjectItem {
    id: string;
    title: string;
    body: string;
    url: string | null;
    state: 'OPEN' | 'CLOSED' | null;
    labels: GithubProjectLabel[];
    isDraft: boolean;
}

export interface GithubProjectColumn {
    id: string;
    name: string;
    color: string;
    items: GithubProjectItem[];
}

export interface GithubProjectBoard {
    id: string;
    title: string;
    url: string;
    columns: GithubProjectColumn[];
}

const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

const STATUS_COLOR_MAP: Record<string, string> = {
    GREEN: '#2da44e',
    YELLOW: '#bf8700',
    ORANGE: '#e16f24',
    RED: '#cf222e',
    PINK: '#bf3989',
    PURPLE: '#8250df',
    BLUE: '#0969da',
    GRAY: '#6e7781',
};

const QUERY = `
query($org: String!, $number: Int!) {
  organization(login: $org) {
    projectV2(number: $number) {
      id
      title
      url
      fields(first: 20) {
        nodes {
          ... on ProjectV2SingleSelectField {
            id
            name
            options { id name color }
          }
        }
      }
      items(first: 100) {
        nodes {
          id
          content {
            ... on Issue {
              title
              body
              url
              state
              labels(first: 5) { nodes { name color } }
            }
            ... on DraftIssue {
              title
              body
            }
          }
          fieldValues(first: 10) {
            nodes {
              ... on ProjectV2ItemFieldSingleSelectValue {
                name
                field { ... on ProjectV2SingleSelectField { name } }
              }
            }
          }
        }
      }
    }
  }
}
`;

interface RawFieldNode {
    id?: string;
    name?: string;
    options?: { id: string; name: string; color: string }[];
}

interface RawItemContent {
    title?: string;
    body?: string;
    url?: string;
    state?: 'OPEN' | 'CLOSED';
    labels?: { nodes: { name: string; color: string }[] };
}

interface RawFieldValue {
    name?: string;
    field?: { name?: string };
}

interface RawItem {
    id: string;
    content: RawItemContent | null;
    fieldValues: { nodes: RawFieldValue[] };
}

interface RawResponse {
    data: {
        organization: {
            projectV2: {
                id: string;
                title: string;
                url: string;
                fields: { nodes: RawFieldNode[] };
                items: { nodes: RawItem[] };
            };
        };
    };
    errors?: { message: string }[];
}

export async function fetchGitHubProject(
    org: string,
    projectNumber: number,
): Promise<GithubProjectBoard> {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error('GITHUB_TOKEN env var not set');

    const res = await fetch(GITHUB_GRAPHQL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: QUERY, variables: { org, number: projectNumber } }),
        next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`GitHub GraphQL error: ${res.status}`);

    const json = (await res.json()) as RawResponse;
    if (json.errors?.length) throw new Error(json.errors[0].message);

    const project = json.data.organization.projectV2;

    const statusField = project.fields.nodes.find(
        (f) => f.name === 'Status' && f.options,
    );
    const options = statusField?.options ?? [];

    const columnMap = new Map<string, GithubProjectColumn>();
    for (const opt of options) {
        columnMap.set(opt.name, {
            id: opt.id,
            name: opt.name,
            color: STATUS_COLOR_MAP[opt.color] ?? '#6e7781',
            items: [],
        });
    }
    const untriagedColumn: GithubProjectColumn = {
        id: 'untriaged',
        name: 'Untriaged',
        color: STATUS_COLOR_MAP['GRAY'],
        items: [],
    };

    for (const rawItem of project.items.nodes) {
        if (!rawItem.content) continue;
        const content = rawItem.content;
        const isDraft = !('url' in content);

        const item: GithubProjectItem = {
            id: rawItem.id,
            title: content.title ?? '',
            body: content.body ?? '',
            url: 'url' in content ? (content.url ?? null) : null,
            state: 'state' in content ? (content.state ?? null) : null,
            labels: 'labels' in content ? (content.labels?.nodes ?? []) : [],
            isDraft,
        };

        const statusValue = rawItem.fieldValues.nodes.find(
            (fv) => fv.field?.name === 'Status',
        );
        const colName = statusValue?.name;
        const col = colName ? columnMap.get(colName) : null;

        if (col) {
            col.items.push(item);
        } else {
            untriagedColumn.items.push(item);
        }
    }

    const columns = [...columnMap.values()];
    if (untriagedColumn.items.length > 0) columns.push(untriagedColumn);

    return {
        id: project.id,
        title: project.title,
        url: project.url,
        columns,
    };
}
