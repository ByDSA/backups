import { FlatTree } from "../FlatTree.js";

export type Hash = string;

export type HashesMap = Map<Hash, FlatTree[]>;

export type Path = string;

export type PathsMap = Map<Path, FlatTree>;
