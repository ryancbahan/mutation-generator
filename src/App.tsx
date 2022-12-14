import { useState, useEffect } from 'react';
import introspectionQuery from '../graphql.schema.json'
import { buildClientSchema, printSchema, Source, buildSchema, IntrospectionQuery, print } from 'graphql'
import enTranslations from '@shopify/polaris/locales/en.json';
import synthwave84 from 'prism-react-renderer/themes/synthwave84';
import Highlight, { defaultProps } from "prism-react-renderer";
import {
  AppProvider,
  Page,
  ResourceList,
  ResourceItem,
  Card,
  Stack,
  Button,
  Filters,
  TextField,
  Frame,
  Heading,
  TextStyle,
  TextContainer,
  Link,
  Pagination
} from '@shopify/polaris';

import {
  generateMutations,
} from "./generateMutations";

function App() {
  const [paginationIndex, setPaginationIndex] = useState(0)
  const [queryValue, setQueryValue] = useState("");
  const [list, setList] = useState<any[]>([])

  useEffect(() => {
    if (!list.length) {
      const builtSchema = buildClientSchema(introspectionQuery as IntrospectionQuery);
      const schemaLanguage = printSchema(builtSchema);
      const source = new Source(schemaLanguage);
      const validSchema = buildSchema(source, { assumeValidSDL: true });
      const mutationList: any[] = generateMutations(validSchema)!;
      setList(mutationList)
    }
  }, [])

  function renderArg(arg: any) {
    const { name, description } = arg

    return (
      <span key={description}>
        <Stack.Item>
          <TextContainer spacing="tight">
            <p>
              <b>{name?.value}</b>: {description?.value}
            </p>
          </TextContainer>
        </Stack.Item>
      </span>
    );
  }

  function renderItem(item: any) {
    const { mutationInfo, mutationDocument, variableValues } = item
    const { args } = mutationInfo

    return (
      <ResourceItem id={mutationInfo.name} onClick={() => { }}>
        <Card title={mutationInfo.name}>
          <Card.Section>
            <Stack vertical>
              <Stack.Item>
                <TextContainer>
                  <p>{mutationInfo.description.value}</p>
                </TextContainer>
              </Stack.Item>
              <Stack.Item>
                <Heading element='h3'>
                  Arguments
                </Heading>
              </Stack.Item>
              {args.map((arg: any) => renderArg(arg))}
              <Stack.Item>
                <TextContainer>
                  <Heading>Example</Heading>
                  <p><TextStyle variation='strong'>Mutation</TextStyle></p>
                  <Highlight {...defaultProps} theme={synthwave84} code={print(mutationDocument)} language="graphql">
                    {({ className, style, tokens, getLineProps, getTokenProps }) => (
                      <pre className={className} style={style}>
                        {tokens.map((line, i) => (
                          <div {...getLineProps({ line, key: i })}>
                            {line.map((token, key) => (
                              <span {...getTokenProps({ token, key })} />
                            ))}
                          </div>
                        ))}
                      </pre>
                    )}
                  </Highlight>
                  <p><TextStyle variation='strong'>Variables</TextStyle></p>
                  <Highlight {...defaultProps} theme={synthwave84} code={JSON.stringify(variableValues, null, '\t')} language="jsx">
                    {({ className, style, tokens, getLineProps, getTokenProps }) => (
                      <pre className={className} style={style}>
                        {tokens.map((line, i) => (
                          <div {...getLineProps({ line, key: i })}>
                            {line.map((token, key) => (
                              <span {...getTokenProps({ token, key })} />
                            ))}
                          </div>
                        ))}
                      </pre>
                    )}
                  </Highlight>
                </TextContainer>
              </Stack.Item>
            </Stack>
          </Card.Section>
          <Card.Section>
            <Stack alignment='center'>
              <Button primary>Run once</Button>
              <Button>Run five times</Button>
            </Stack>
          </Card.Section>
        </Card>
      </ResourceItem>
    )
  }

  const filters = [
    {
      key: "taggedWith",
      label: "Tagged with",
      filter: (
        <TextField
          label="Tagged with"
          value={"taggedWith"}
          onChange={() => { }}
          autoComplete="off"
          labelHidden
        />
      ),
      shortcut: true,
    },
  ];

  const filterControl = (
    <Filters
      queryValue={queryValue}
      filters={filters}
      onQueryChange={setQueryValue}
      onQueryClear={() => setQueryValue("")}
      onClearAll={() => setQueryValue("")}
    />
  );

  const resourceName = {
    singular: "available mutations",
    plural: "available mutations",
  };


  const onPrevious = () => {
    if (paginationIndex === 0 || !filteredItems.length) {
      setPaginationIndex(0)
      return
    }
    setPaginationIndex(paginationIndex - 10)
  }

  const onNext = () => {
    if (!filteredItems.length) {
      setPaginationIndex(paginationIndex - 10)
      return
    }
    setPaginationIndex(paginationIndex + 10)
  }

  const filteredItems = list
    .filter(item => item.mutationInfo.name.includes(queryValue))
    .slice(paginationIndex, paginationIndex + 10)

  return (
    <AppProvider i18n={enTranslations}>
      <Frame>
        <Page title="Dev Portal">
          <Stack distribution='center' alignment='center'>
            <Pagination
              hasPrevious={paginationIndex > 0}
              onPrevious={onPrevious}
              hasNext={filteredItems.length > 0}
              onNext={onNext}
            />
          </Stack>
          <ResourceList
            resourceName={resourceName}
            items={filteredItems!}
            filterControl={filterControl}
            renderItem={renderItem}
          />
          <Stack distribution='center' alignment='center'>
            <Pagination
              hasPrevious={paginationIndex > 0}
              onPrevious={onPrevious}
              hasNext={filteredItems.length > 0}
              onNext={onNext}
            />
          </Stack>
        </Page>
      </Frame>
    </AppProvider>
  )
}

export default App
