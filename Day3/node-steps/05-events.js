// =====================================================================================
// STEP 05 - EventEmitter: the idea behind res.on("finish"), req.on("data"), streams ...
// Run:  node 05-events.js
//
// WHAT YOU LEARN
//   - one part of the program emits a named event, other parts listen
//   - the emitter does not know who is listening (loose coupling)
//
// CONCEPT: the OBSERVER pattern. Instead of calling other code directly ("send the email, then reduce stock,
// then log analytics"), the code that creates an order just ANNOUNCES "created". Anyone interested subscribes.
// New listeners can be added without touching the code that emits.
// =====================================================================================
import { EventEmitter } from "node:events";

// EventEmitter is a class that provides on(), once() and emit(). Extending it gives our own class those methods.
// (Many Node objects, such as HTTP servers and responses, are EventEmitters.)
class OrderSystem extends EventEmitter {}
const orders = new OrderSystem();

// emitter.on(eventName, listener)
//   USAGE: register a listener. It runs EVERY time the event is emitted. Listeners run in the order they were added.
orders.on("created", (order) => console.log("email service: send receipt for order", order.id));
orders.on("created", (order) => console.log("stock service: reduce stock by", order.qty));

// emitter.once(eventName, listener)
//   USAGE: like on(), but the listener removes itself after its first call.
orders.once("created", () => console.log("analytics: first order ever!"));

// emitter.emit(eventName, ...arguments)
//   USAGE: trigger the event. Every listener is called synchronously with the arguments given here.
orders.emit("created", { id: 1, qty: 2 });
orders.emit("created", { id: 2, qty: 5 }); // the "once" listener is gone now, so no analytics line

// In Express you will meet this pattern again: res.on("finish", ...) in the timer middleware (express step 04).
// NOTE: emitting the special event name "error" with NO listener makes Node throw and stop the program.
