declare enum Kind {
    /** Type Definitions */
    SCALAR_TYPE_DEFINITION = 'ScalarTypeDefinition',
    OBJECT_TYPE_DEFINITION = 'ObjectTypeDefinition',
    FIELD_DEFINITION = 'FieldDefinition',
    INPUT_VALUE_DEFINITION = 'InputValueDefinition',
    INTERFACE_TYPE_DEFINITION = 'InterfaceTypeDefinition',
    UNION_TYPE_DEFINITION = 'UnionTypeDefinition',
    ENUM_TYPE_DEFINITION = 'EnumTypeDefinition',
    ENUM_VALUE_DEFINITION = 'EnumValueDefinition',
    INPUT_OBJECT_TYPE_DEFINITION = 'InputObjectTypeDefinition',
    /** Type Extensions */
    SCALAR_TYPE_EXTENSION = 'ScalarTypeExtension',
    OBJECT_TYPE_EXTENSION = 'ObjectTypeExtension',
    INTERFACE_TYPE_EXTENSION = 'InterfaceTypeExtension',
    UNION_TYPE_EXTENSION = 'UnionTypeExtension',
    ENUM_TYPE_EXTENSION = 'EnumTypeExtension',
    INPUT_OBJECT_TYPE_EXTENSION = 'InputObjectTypeExtension',
  }
