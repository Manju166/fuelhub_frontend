import { gql } from "@apollo/client";

export const UPLOAD_CSV = gql`
  mutation UploadCsv($input: UploadCsvInput!) {
    uploadCsv(input: $input) {
      success
      errors
    }
  }
`;


// import { gql } from "@apollo/client";

// export const UPLOAD_CSV = gql`
//   mutation UploadCsv($file: Upload!) {
//     uploadCsv(input: { file: $file }) {
//       errors
//       success
//     }
//   }
// `;


