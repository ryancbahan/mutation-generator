import {
    Kind,
    GraphQLSchema,
    OperationTypeNode,
    Location,
    DocumentNode,
    NameNode,
    FieldDefinitionNode,
    TypeNode,
    SelectionSetNode,
    InputObjectTypeDefinitionNode,
    ObjectTypeDefinitionNode,
    ArgumentNode,
    VariableDefinitionNode,
    DefinitionNode
} from "graphql"
import * as graphqlData from './generated/graphql'
import * as graphqlDataTypes from './generated/graphql'

function getName(name: string): NameNode {
    return {
        kind: Kind.NAME,
        value: name
    }
}

// Default location
const loc: Location = {
    start: 0,
    end: 0,
    startToken: null,
    endToken: null,
    source: null
}

function getDocumentDefinition(definitions: DefinitionNode[]): DocumentNode {
    return {
        kind: Kind.DOCUMENT,
        definitions,
        loc
    }
}

function getVariableDefinition(
    name: string,
    type: TypeNode
): VariableDefinitionNode {
    return {
        kind: Kind.VARIABLE_DEFINITION,
        type: type,
        variable: {
            kind: Kind.VARIABLE,
            name: getName(name)
        }
    }
}

function getVariable(argName: string, varName: string): ArgumentNode {
    return {
        kind: Kind.ARGUMENT,
        loc,
        name: getName(argName),
        value: {
            kind: Kind.VARIABLE,
            name: getName(varName)
        }
    }
}

export function getTypeName(type: TypeNode): string {
    if (type?.kind === Kind.NAMED_TYPE) {
        return type.name.value
    } else if (type?.kind === Kind.LIST_TYPE) {
        return getTypeName(type.type)
    } else if (type?.kind === Kind.NON_NULL_TYPE) {
        return getTypeName(type.type)
    } else {
        throw new Error(`Cannot get name of type: ${type}`)
    }
}

function isListType(type: TypeNode): boolean {
    if (type.kind === 'NamedType') {
        return false
    } else {
        if (type.kind === 'ListType') {
            return true
        } else {
            return isListType(type.type)
        }
    }
}

const getScalarValue = (argTypeName: string) => {
    if (argTypeName === "String") {
        return "Placeholder"
    }
    if (argTypeName === "Boolean") {
        return true
    }
    if (argTypeName === "ID") {
        return "Placeholder ID"
    }

    if (argTypeName === "Int") {
        return 10
    }

    if (argTypeName === "Float") {
        return 10.00
    }
}

const getCustomScalarValue = (argTypeName: string) => {
    if (argTypeName === "Decimal") {
        return "10.00"
    }

    if (argTypeName === "URL") {
        return "https://google.com"
    }

    if (argTypeName === "DateTime") {
        return new Date().toISOString()
    }

    return "todo: custom scalar value"
}

const getEnumTypeValue = (argTypeName: string) => {
    const lookup = graphqlData as any;

    if (argTypeName === 'CurrencyCode') {
        return graphqlData.CurrencyCode.Usd
    }

    const value = Object.keys(lookup[argTypeName])[0]
    if (value) {
        return value
    } else {
        throw new Error("can't find enum to seed")
    }
}

const getNestedObjectValues = (node: InputObjectTypeDefinitionNode | ObjectTypeDefinitionNode, schema: GraphQLSchema, nextSelectionSet?: SelectionSetNode) => {
    const selectionSet: SelectionSetNode = {
        kind: Kind.SELECTION_SET,
        selections: []
    }

    const selection = {
        kind: Kind.FIELD,
        name: getName(node.name.value),
        selectionSet,
        arguments: []
    }

    const output: { [key: string]: any } = {}
    const fields = node.fields

    fields?.forEach(field => {
        const fieldTypeName = getTypeName(field.type);
        const fieldTyping = schema.getType(fieldTypeName);
        const nextNode = fieldTyping?.astNode

        const innerSelectionSet: SelectionSetNode = {
            kind: Kind.SELECTION_SET,
            selections: []
        }

        const innerSelection = {
            kind: Kind.FIELD,
            name: getName(field.name.value),
            selectionSet: innerSelectionSet,
            arguments: []
        }

        const pushTo = nextSelectionSet ? nextSelectionSet : selectionSet
        pushTo.selections.push(innerSelection)

        if (!nextNode) {
            output[field.name.value] = getScalarValue(fieldTypeName)
        }

        if (nextNode?.kind === Kind.SCALAR_TYPE_DEFINITION) {
            output[field.name.value] = getCustomScalarValue(fieldTypeName)
        }

        if (nextNode?.kind === Kind.ENUM_TYPE_DEFINITION) {
            output[field.name.value] = getEnumTypeValue(fieldTypeName)
        }

        if (nextNode?.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION) {
            const { output: nextOutput } = getNestedObjectValues(nextNode, schema, innerSelectionSet)
            output[field.name.value] = nextOutput
        }

        // prune empty selection sets
        // todo: only append if values
        if (!innerSelection?.selectionSet?.selections?.length) {
            delete innerSelection.selectionSet
        }
    })

    return { output, selectionSet }
}

const generateArgsForMutation = (mutation: FieldDefinitionNode, schema: GraphQLSchema) => {
    const mutationArgs = mutation.arguments

    const output: { [key: string]: any } = {}

    mutationArgs?.forEach(argument => {
        const varName = `Mutation__${mutation.name.value}__${argument.name.value}`
        const argTypeName = getTypeName(argument.type);
        const fieldTyping = schema.getType(argTypeName);
        const nextNode = fieldTyping?.astNode
        const isList = isListType(argument.type)

        if (isList && !nextNode) {
            output[varName] = [getScalarValue(argTypeName)]
            return
        }

        if (!nextNode) {
            output[varName] = getScalarValue(argTypeName)
            return
        }

        if (nextNode?.kind === Kind.SCALAR_TYPE_DEFINITION) {
            output[varName] = getCustomScalarValue(argTypeName)
            return
        }

        if (nextNode?.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION) {
            const { output: nextOutput } = getNestedObjectValues(nextNode, schema)
            output[varName] = nextOutput
            return
        }

        if (nextNode?.kind === Kind.ENUM_TYPE_DEFINITION) {
            output[varName] = getEnumTypeValue(argTypeName)
            return
        }
    })

    return { output }
}

const generateFieldsAndVarsForMutation = (mutation: FieldDefinitionNode, schema: GraphQLSchema) => {
    const mutationTypeName = getTypeName(mutation.type)
    const mutationFieldTyping = schema.getType(mutationTypeName)
    const fields = mutationFieldTyping?.astNode?.fields
    const selections = []
    const args: ArgumentNode[] = []
    const variableDefinitionsMap: {
        [varName: string]: VariableDefinitionNode
    } = {}

    mutation?.arguments?.forEach(arg => {
        const varName = `Mutation__${mutation.name.value}__${arg.name.value}`
        variableDefinitionsMap[varName] = getVariableDefinition(varName, arg.type)
        args.push(getVariable(arg.name.value, varName))
    })

    const selectionSet: SelectionSetNode = {
        kind: Kind.SELECTION_SET,
        selections: []
    }

    selections.push({
        kind: Kind.FIELD,
        name: getName(mutation.name.value),
        selectionSet,
        arguments: args
    })

    fields?.forEach((field: FieldDefinitionNode) => {
        const fieldTypeName = getTypeName(field.type);
        const fieldTyping = schema.getType(fieldTypeName);
        const nextNode = fieldTyping?.astNode

        const selection = {
            kind: Kind.FIELD,
            name: getName(field.name.value),
            arguments: []
        }

        selectionSet.selections.push(selection)

        if (nextNode?.kind === Kind.OBJECT_TYPE_DEFINITION) {
            const { selectionSet: nextSelectionSet } = getNestedObjectValues(nextNode, schema)
            selection.selectionSet = nextSelectionSet
        }
    })

    return { selections, variableDefinitionsMap }
}

export function generateMutations(
    schema: GraphQLSchema
) {

    const mutationRoot = schema.getMutationType()!.astNode!

    // just use one mutation at a time for now because seeing all 254 in dev is a lot

    // const outputs = mutationRoot.fields?.map(field => {
    //   const args = generateArgsForMutation(field, schema)
    //   const mutationDocument = {
    //     kind: Kind.OPERATION_DEFINITION,
    //     operation: 'mutation',
    //     // selectionSet,
    //     // variableDefinitions: Object.values(variableDefinitionsMap),
    //     loc,
    //     name: getName(field.name.value)
    //   }

    //   return {mutationDocument, args}
    // });

    // console.log({outputs})

    const { output: variableValues } = generateArgsForMutation(mutationRoot?.fields[1], schema)
    const { selections, variableDefinitionsMap } = generateFieldsAndVarsForMutation(mutationRoot?.fields[1], schema)

    const selectionSet = {
        kind: Kind.SELECTION_SET,
        selections
    }

    const document = {
        kind: Kind.OPERATION_DEFINITION,
        operation: 'mutation' as OperationTypeNode,
        selectionSet,
        variableDefinitions: Object.values(variableDefinitionsMap),
        loc,
        name: getName(mutationRoot!.fields![1]?.name?.value)
    }

    const definitions = [document]
    const mutationDocument = getDocumentDefinition(definitions)

    return {
        mutationDocument,
        variableValues,
    }
}
