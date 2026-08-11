No. JSDoc comments work without installing anything — editors (VS Code/Cursor) already read `/** ... */` for hover/docs.

You only need a package if you want to **generate docs site/files** from those comments:

- `jsdoc` — classic HTML docs from JS/JSDoc  
- `typedoc` — better fit for TypeScript projects  

For your Express app, the comments alone are enough unless you want generated documentation output.