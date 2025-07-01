import { EventEmitter } from "emitter";

type EventMap = {
  update: void;
};

export const emitter = new EventEmitter<EventMap>();
