import { useState } from 'react';
import introspectionQuery from '../graphql.schema.json'
import { buildClientSchema, printSchema, Source, buildSchema, IntrospectionQuery, print } from 'graphql'
import enTranslations from '@shopify/polaris/locales/en.json';
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
  TextContainer
} from '@shopify/polaris';

import {
  generateMutations,
} from "./generateMutations";

function App() {
  const [queryValue, setQueryValue] = useState("");
  const builtSchema = buildClientSchema(introspectionQuery as IntrospectionQuery);
  const schemaLanguage = printSchema(builtSchema);
  const source = new Source(schemaLanguage);
  const validSchema = buildSchema(source, { assumeValidSDL: true });

  const mutationList: any[] = generateMutations(validSchema)!;

  function renderItem(item: any) {
    const { mutationInfo } = item

    return (
      <ResourceItem id={Math.random().toString()} onClick={() => { }}>
        <Card>
          <Card.Section>
            <Stack vertical>
              <Stack.Item>
                <TextContainer>
                  <Heading>
                    {mutationInfo.name}
                  </Heading>
                  <p>{mutationInfo.description.value}</p>
                </TextContainer>
              </Stack.Item>
              <Stack.Item>
                <Heading element='h3'>
                  Arguments
                </Heading>
              </Stack.Item>
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

  const filteredItems = mutationList.filter(item => item.mutationInfo.name.includes(queryValue))

  return (
    <AppProvider i18n={enTranslations}>
      <Frame>
        <Page title="Example app">
          <ResourceList
            resourceName={resourceName}
            items={filteredItems!}
            filterControl={filterControl}
            renderItem={renderItem}
          />
        </Page>
      </Frame>
    </AppProvider>
  )
}

export default App
