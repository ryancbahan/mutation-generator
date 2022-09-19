if (selectionNode.kind === Kind.FIELD) {
    let fieldName = selectionNode.name.value
    if (fieldName in aliasIndexes) {
      cleanselections.push({
        ...selectionNode,
        ...{
          alias: {
            kind: Kind.NAME,
            value: `${fieldName}${aliasIndexes[fieldName]++}`
          }
        }
      })
    } else {
      aliasIndexes[fieldName] = 2
      cleanselections.push(selectionNode)
    }
  }

  {
    "kind": "Field",
    "name": {
        "kind": "Name",
        "value": "hasStagedLineItemDiscount"
    },
    "arguments": []
}

selections.push({
    kind: Kind.FIELD,
    name: getName(field.name.value),
    selectionSet,
    arguments: avs.args
  })

  {
    "kind": "Field",
    "name": {
        "kind": "Name",
        "value": "orderEditAddVariant"
    },
    "selectionSet": {
        "kind": "SelectionSet",
        "selections": [
            {
                "kind": "Field",
                "name": {
                    "kind": "Name",
                    "value": "calculatedLineItem"
                },
                "selectionSet": {
                    "kind": "SelectionSet",
                    "selections": [
                        {
                            "kind": "Field",
                            "name": {
                                "kind": "Name",
                                "value": "hasStagedLineItemDiscount"
                            },
                            "arguments": []
                        },
                        {
                            "kind": "Field",
                            "name": {
                                "kind": "Name",
                                "value": "id"
                            },
                            "arguments": []
                        },
                        {
                            "kind": "Field",
                            "name": {
                                "kind": "Name",
                                "value": "restocking"
                            },
                            "arguments": []
                        },
                        {
                            "kind": "Field",
                            "name": {
                                "kind": "Name",
                                "value": "sku"
                            },
                            "arguments": []
                        },
                        {
                            "kind": "Field",
                            "name": {
                                "kind": "Name",
                                "value": "variantTitle"
                            },
                            "arguments": []
                        }
                    ]
                },
                "arguments": []
            }
        ]
    },
    "arguments": [
        {
            "kind": "Argument",
            "loc": {
                "start": 0,
                "end": 0,
                "startToken": null,
                "endToken": null,
                "source": null
            },
            "name": {
                "kind": "Name",
                "value": "id"
            },
            "value": {
                "kind": "Variable",
                "name": {
                    "kind": "Name",
                    "value": "Mutation__orderEditAddVariant__id"
                }
            }
        },
        {
            "kind": "Argument",
            "loc": {
                "start": 0,
                "end": 0,
                "startToken": null,
                "endToken": null,
                "source": null
            },
            "name": {
                "kind": "Name",
                "value": "quantity"
            },
            "value": {
                "kind": "Variable",
                "name": {
                    "kind": "Name",
                    "value": "Mutation__orderEditAddVariant__quantity"
                }
            }
        },
        {
            "kind": "Argument",
            "loc": {
                "start": 0,
                "end": 0,
                "startToken": null,
                "endToken": null,
                "source": null
            },
            "name": {
                "kind": "Name",
                "value": "variantId"
            },
            "value": {
                "kind": "Variable",
                "name": {
                    "kind": "Name",
                    "value": "Mutation__orderEditAddVariant__variantId"
                }
            }
        }
    ]
}

  {
    "kind": "SelectionSet",
    "selections": [
        {
            "kind": "Field",
            "name": {
                "kind": "Name",
                "value": "orderEditAddVariant"
            },
            "selectionSet": {
                "kind": "SelectionSet",
                "selections": [
                    {
                        "kind": "Field",
                        "name": {
                            "kind": "Name",
                            "value": "calculatedLineItem"
                        },
                        "selectionSet": {
                            "kind": "SelectionSet",
                            "selections": [
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "hasStagedLineItemDiscount"
                                    },
                                    "arguments": []
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "id"
                                    },
                                    "arguments": []
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "restocking"
                                    },
                                    "arguments": []
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "sku"
                                    },
                                    "arguments": []
                                },
                                {
                                    "kind": "Field",
                                    "name": {
                                        "kind": "Name",
                                        "value": "variantTitle"
                                    },
                                    "arguments": []
                                }
                            ]
                        },
                        "arguments": []
                    }
                ]
            },
            "arguments": [
                {
                    "kind": "Argument",
                    "loc": {
                        "start": 0,
                        "end": 0,
                        "startToken": null,
                        "endToken": null,
                        "source": null
                    },
                    "name": {
                        "kind": "Name",
                        "value": "id"
                    },
                    "value": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "Mutation__orderEditAddVariant__id"
                        }
                    }
                },
                {
                    "kind": "Argument",
                    "loc": {
                        "start": 0,
                        "end": 0,
                        "startToken": null,
                        "endToken": null,
                        "source": null
                    },
                    "name": {
                        "kind": "Name",
                        "value": "quantity"
                    },
                    "value": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "Mutation__orderEditAddVariant__quantity"
                        }
                    }
                },
                {
                    "kind": "Argument",
                    "loc": {
                        "start": 0,
                        "end": 0,
                        "startToken": null,
                        "endToken": null,
                        "source": null
                    },
                    "name": {
                        "kind": "Name",
                        "value": "variantId"
                    },
                    "value": {
                        "kind": "Variable",
                        "name": {
                            "kind": "Name",
                            "value": "Mutation__orderEditAddVariant__variantId"
                        }
                    }
                }
            ]
        }
    ]
}
