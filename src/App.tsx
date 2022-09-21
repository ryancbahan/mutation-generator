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
  Heading,
  Button,
  Filters,
  TextField,
  Frame
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

  const outputs = generateMutations(validSchema);

  console.log({outputs})

  function renderItem({ name, description, args }: {name: string, description: string, args: any[]}) {
    return (
      <ResourceItem id={name} onClick={() => { }}>
        <Card>
          <Card.Section>
            <Stack vertical spacing="loose">
              <Stack.Item>
                <Heading>{name}</Heading>
                <p>{description}</p>
              </Stack.Item>
              <Stack.Item>
                <Heading>Arguments</Heading>
                {/* {args?.map((arg) => renderArgs(arg))} */}
              </Stack.Item>
              <Stack>
                <Button primary>Run mutation once</Button>
                <Button>Run mutation five times</Button>
              </Stack>
            </Stack>
          </Card.Section>
        </Card>
      </ResourceItem>
    );
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

  const filteredList: any[] = []

  return (
    <AppProvider i18n={enTranslations}>
      <Frame>
        <Page title="Example app">
          <ResourceList
            resourceName={resourceName}
            items={filteredList}
            filterControl={filterControl}
            renderItem={renderItem}
          />
        </Page>
      </Frame>
    </AppProvider>
  )
}

export default App
