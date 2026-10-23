# @repo/url-state

`useAtomsInUrl([textParam("q", queryAtom), optionParam("tag", tagAtom)])`
keeps Effect Atom state in the URL so filtered views can be shared. It reads
the URL after the first render, so prerendered HTML and hydration agree, and
writes with `replaceState`. Use inside a `RegistryProvider`.
