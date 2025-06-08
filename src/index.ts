import { default as mitt_ } from "mitt";
import type { EventType, EventHandlerMap, Emitter, Handler } from "mitt";

export interface EmitterOnce<Events extends Record<EventType, unknown>> extends Emitter<Events> {
  once<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void;
}

/**
* @description hack for the mitt library to support once event listener
*/
export default function mitt<Events extends Record<EventType, unknown>>(
  all?: EventHandlerMap<Events>
): EmitterOnce<Events> {
  const emitter = mitt_<Events>(all);

  return {
    ...emitter,

    // extend the emit method to support once
    once<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>) {
      const fn = (arg: Events[Key]) => {
        emitter.off(type, fn);
        handler(arg);
      };
      emitter.on(type, fn);
    },
  };
}
