import { gql } from '@apollo/client';

export const CREATE_RESOURCE = gql`
 mutation CreateResources($resourceInput: ResourceInput!){
  createResource(input:{resourceInput: $resourceInput}){
    resource{
      tenantId
      resourceCategory
      resourceStatus
    }
    errors
  }
}
`;

export const UPDATE_RESOURCE = gql`
 mutation UpdateResource($resource: ResourceInput!){
  updateResource(input:{resource: $resource}){
    resource{
      tenantId
      resourceStatus
      resourceCategory
    }
  }
}
`;

export const DELETE_RESOURCE = gql`
 mutation DeleteResources($id: ID!){
  deleteResource(input:{id: $id})
  {
    errors
    success
  }
}
`;


