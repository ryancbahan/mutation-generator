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
  TextContainer,
  Link
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

  function renderArg(arg: any) {
    const { name, description } = arg

    return (
      <span key={Math.random().toString()}>
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

    console.log({ variableValues })

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
              {args.map((arg: any) => renderArg(arg))}
              <Stack.Item>
                <TextContainer>
                  <Heading>Example</Heading>
                  <p><TextStyle variation='strong'>Mutation</TextStyle></p>
                  <code>{print(mutationDocument)}</code>
                  <p><TextStyle variation='strong'>Variables</TextStyle></p>
                  <code>{JSON.stringify(variableValues, null, '\t')}</code>
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

  const filteredItems = mutationList.filter(item => item.mutationInfo.name.includes(queryValue))

  return (
    <AppProvider i18n={enTranslations}>
      <Frame>
        <Page title="Dev Portal">
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
