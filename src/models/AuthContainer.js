import { Container } from "overstated";

const R = require("ramda");
const object = require("json-templater").object;

class AuthContainer extends Container {
  constructor() {
    super();
    this.state = { isModified: false, methods: [] };
  }
  // @ts-ignore
  setState(state, cb) {
    super.setState({ isModified: true, ...state }, cb);
  }
  init(methods) {
    this.setState({ isModified: false, methods: methods || [] });
  }
  reset() {
    this.setState({ isModified: false, methods: [] });
  }
  setModified(isModified) {
    this.setState({ isModified });
  }
  isModified() {
    return this.state.isModified;
  }
  addNewMethod() {
    this.addMethod(this.createEmptyMethd());
  }
  addMethod(method) {
    this.setState({
      methods: [
        ...R.map(this.cloneNonSelected, this.state.methods || []),
        method
      ]
    });
  }
  deleteMethod(index) {
    console.log(`deleteMethod ${index}`);
    const methods = R.remove(index, 1, this.methodsWithOldIndexes());
    this.setState({ methods });
    return methods;
  }
  duplicateMethod(index) {
    console.log(`duplicate ${index}`);
    const oldMethods = this.methodsWithOldIndexes();
    const method = oldMethods[index];
    if (!method) return null;
    const methods = R.insert(
      index + 1,
      R.assoc(
        "name",
        `${method.name} (copy)`,
        R.assoc("selected", false, method)
      ),
      oldMethods
    );
    this.setState({ methods });
    return methods;
  }
  replaceSelectedMethod(replaceWith) {
    return this.setState({
      isModified: true,
      methods: R.map(
        R.when(R.prop("selected"), R.partial(R.identity, [replaceWith])),
        this.state.methods
      )
    });
  }
  getMethods() {
    return this.state.methods || [];
  }
  getSize() {
    return this.getMethods().length;
  }
  isEmpty() {
    return this.getMethods().length == 0;
  }
  createEmptyMethd() {
    return {
      name: this.getNamePlaceholder(),
      selected: true
    };
  }
  getNamePlaceholder() {
    // @ts-ignore
    const oldWithNum = this.state.methods
      .reverse()
      .find(r => r.name.indexOf("method-") >= 0);
    return oldWithNum
      ? `method-${Number(oldWithNum.name.split("method-")[1]) + 1}`
      : "method-0";
  }
  cloneNonSelected(method) {
    if (!method) throw new Error("method not specified");
    return R.assoc("selected", false, method);
  }
  select(index) {
    console.log(`AuthContainer: selecting method at ${index}`);
    const selectedLens = R.lensProp("selected");
    const notSelectedRequests = R.map(
      R.assoc("selected", false),
      this.state.methods
    );
    const methods = R.over(
      R.lensIndex(index),
      R.set(selectedLens, true),
      notSelectedRequests
    );
    return this.setState({ methods });
  }
  methodsWithOldIndexes() {
    return this.state.methods.map((m, i) => ({
      ...m,
      oldIndex: i
    }));
  }
  move({ oldIndex, newIndex }) {
    console.log(`AuthContainer: move ${oldIndex} -> ${newIndex}`);
    const oldMethods = this.methodsWithOldIndexes();
    const methods = R.move(oldIndex, newIndex, oldMethods);
    this.setState({
      methods
    });
    return methods;
  }
  getSelected() {
    console.log("AuthContainer.getSelected");
    if (this.isEmpty()) return {};
    return R.find(R.prop("selected"))(this.state.methods) || {};
    // return selected || this.state.methods[0];
  }
  setProp(prop, value) {
    const method = this.getSelected();
    if (!method) return;
    const newMethod = R.assoc(prop, value, method);
    console.log(`setProp: new method ${JSON.stringify(newMethod)}`);
    this.replaceSelectedMethod(newMethod);
    return newMethod;
  }
  getProp(prop) {
    return R.prop(prop, this.getSelected());
  }
}

export default new AuthContainer();
