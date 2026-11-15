# OpenDesign artifact delivery

Use for artifacts under `./opendesign/`. Aliases are defined in [ALIASES.md](../ALIASES.md).

This delivery contract takes precedence over conflicting helper examples. When delegating @setup or @preview, include these constraints explicitly in the task: exact project root and artifact URL; reuse only after checking served content against that artifact; bind to loopback; use an existing runtime without installing packages; choose a free port instead of stopping an unrelated server. Do not forward only a helper name. If the helper cannot follow the contract, perform the setup/serve operation directly with the available runtime.

1. Initialize the viewer with @setup when `index.html` is absent. If @setup is unavailable or its network fetch fails, copy the packaged `viewer.html` beside the OpenDesign entrypoint into `index.html`; preserve existing project files.
2. Store mockups under `mockups/<task-slug>/` and systems under `design-systems/<name>/`; ensure assets resolve.
3. Scan **all** `.html` files below `mockups/` and **all** files below `design-systems/`. Rebuild `manifest.json` rather than appending the newest artifact. Omit empty groups. Preserve this viewer schema:

   ```json
   {
     "generated": "<current ISO 8601 timestamp>",
     "sections": [
       {
         "id": "mockups",
         "label": "Mockups",
         "groups": [
           {
             "slug": "<subfolder-name>",
             "files": [
               { "label": "<filename>", "path": "mockups/<subfolder-name>/<filename>" }
             ]
           }
         ]
       },
       {
         "id": "design-systems",
         "label": "Design Systems",
         "groups": [
           {
             "slug": "<subfolder-name>",
             "files": [
               { "label": "<filename>", "path": "design-systems/<subfolder-name>/<filename>" }
             ]
           }
         ]
       }
     ]
   }
   ```


4. Launch/reuse @preview. If unavailable, use an existing local runtime to serve the directory and verify the URL/assets before linking. Verify the served artifact belongs to this project, not just an HTTP 200 from another preview. If a helper port is occupied, use another free loopback port without stopping an unrelated process. Use an installed runtime and bind to loopback; do not download a server package as a fallback. A command alone does not prove that the server started.
5. Complete the entrypoint quality pass. Preview reachability is not task or visual acceptance.
