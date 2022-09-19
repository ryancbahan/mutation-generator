import { useState } from 'react'
import './App.css'
import introspectionQuery from '../graphql.schema.json'
import { buildClientSchema, printSchema, Source, buildSchema, IntrospectionQuery, print } from 'graphql'

import {
  generateMutations,
} from "./generate-query";

function App() {
  const builtSchema = buildClientSchema(introspectionQuery as IntrospectionQuery);
  const schemaLanguage = printSchema(builtSchema);
  const source = new Source(schemaLanguage);
  const validSchema = buildSchema(source, { assumeValidSDL: true });

  const configuration = {
    depthProbability: 0.5,
    breadthProbability: 0.5,
    providePlaceholders: true,
    maxDepth: 250,
    ignoreOptionalArguments: true,
  };

  const foo = generateMutations(
    validSchema,
    configuration
  );

  // console.log('printed', print(mutationDocument))
  // console.log({mutationDocument})


  return (
    <div className="App">
      <p>hello world</p>
    </div>
  )
}

export default App
