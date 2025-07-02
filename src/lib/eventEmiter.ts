import { EventEmitter } from "emitter";
import { View } from "../app/page";

type EventMap = {
  update: void;
  menu: View;
};

export const emitter = new EventEmitter<EventMap>();
