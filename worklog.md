Things that slowed me down:

- How can I use a typescript type (union) with zod schema validation?
- How can I handle proper PhoneInput that guarantees format compatibility?
- I had to develop of lots of "lower-level" "infrastructures" to be used by the app as a whole.


Lessons:
- Use schema instead of types in dynamically types languages
- Typescript types are purely compile-time constructs and disappear at runtime, meanwhile schemas like zod schemas exist at runtime.
- Plus signs are considered as spaces when passed as URL params. You can use encodeURIComponent to ensure your verbatim survives.
- Defining your routes and navigation early on in the project is primordial.
- When you provide a UI screenshot as inspiration to an LLM, he can infer the UI structure and try to implement it.

Research & Questions:
- Boundary data and how to deal with it.
- What should wrap which? Store or API calls?
- Should user data and token information be stored separately in local storage and secure storage?
- What is the best way to determine if a user is currently authenticated? Should we just check a raw boolean of the existance of a token?
- Should we store user data just in the state management layer and refetch it every time we need it? Or should we store it with persistence?
- How to implement a decent Logger? My setModuleName is garbage.
- Should you use ContextAPI for multi step processes across different screens?