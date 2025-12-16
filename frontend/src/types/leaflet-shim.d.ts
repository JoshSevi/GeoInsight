// Shim for Leaflet types in this project. We install @types/leaflet as devDependency
// for richer typings, but this file makes sure TypeScript can always resolve
// the module even if editor tooling lags behind.
declare module "leaflet";


