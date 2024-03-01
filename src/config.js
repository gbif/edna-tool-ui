import environments from "./env.json";

const domain = window.location.hostname;

let env = environments.local;
if (
  domain.endsWith("edna-tool.gbif-uat.org") 
) {
  env = environments.uat;
} else if (
  domain.endsWith("edna-tool.gbif.org") 
) {
  env = environments.prod;
} 

export default env;
