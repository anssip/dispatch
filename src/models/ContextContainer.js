import { Container } from 'overstated'; 

const R = require('ramda');

class ContextContainer extends Container {
  constructor(ctx = {}, vars) {
    super();
    this.state = { isModified: false, ctx: ctx || {}, vars: vars || [], selectedEnv: null };
  }

  init(ctx, vars) {
    this.setState({ 
      isModified: false, 
      ctx: ctx || {}, 
      vars: vars || [], 
      selectedEnv: null 
    });
  }

  getValue() {
    return this.state.ctx;
  }

  setValue(value) {
    this.setState({ isModified: true, ctx: value});
  }

  reset() {
    this.setState({ isModified: false, ctx: null });
  }

  isModified() {
    return this.state.isModified;
  }

  setModified(isModified) {
    this.setState({ isModified });
  }


  selectEnv(selectedEnv) {
    console.log(`selecting environment ${selectedEnv}`);
    this.setState({ isModified: true, selectedEnv });
    return this;
  }

  getEnvs() {
    const allValues = R.flatten(R.map(R.prop("values"), this.state.vars));
    return R.uniq(R.map(R.prop("env"), allValues));
  }

  /*
   * Gets all variables from the specified env.
   */
  getEnvironment(env) {    
    // TODO: maybe convert to Ramda
    return this.getVariables().map(v => ({ name: v.name, value: v.values.find(v => v.env == env).value }));
  }

  getSelectedEnv() {
    return this.state.selectEnv;
  }

  getNamePlaceholder(prefix = 'environment-') {
    if (! (this.state && this.state.envs)) return 'Default';
    // @ts-ignore
    const oldWithNum = this.state.envs.reverse().find(r => r.name.indexOf(prefix) >= 0);
    return oldWithNum ? prefix + Number(oldWithNum.name.split(prefix)[1]) + 1 : `${prefix}-0`;
  }

  addNewEnvironment(name = this.getNamePlaceholder()) {
    const newVariables = this.getVariables().map(v => ({ ...v, values: [ ...v.values, { env: name, value: null } ] }));
    this.setState({ isModified: true, vars: newVariables })
    return newVariables;
  }

  // TODO: utilize R.assoc
  addOrUpdateVariable(existingVar, name, value, env) {
    const newVariables = existingVar ? 
      this.getVariables().map(v => v.name == name ? 
        { 
          name: existingVar.name, 
          values: existingVar.values.find(v => v.env == env) ? 
            existingVar.values.map(v => v.env == env ? { env, value } : v) : 
            [ ...existingVar.values, { env, value } ]
        } : v) : 
      [ ...this.getVariables(), this.createNewVariable(env, name, value) ];

    this.setState({ isModified: true, vars: newVariables })
    return newVariables;
  }

  setVariable(env, name, value) {
    const variable = R.find(R.propEq("name", name), this.getVariables());
    return this.addOrUpdateVariable(variable, name, value, env);
  }

  /*
   * Sets the name of the n:th variable.
   */
  setVariableNameAt(n, name) {
    const variable = this.getVariables()[n];
    if (! variable) return null;
    const newVariables = R.map(R.ifElse(R.propEq("name", variable.name), R.assoc("name", name), R.identity), this.getVariables());
    this.setState({ isModified: true, vars: newVariables });
    return newVariables;
  }

  setVariableAt(env, i, props) {
    const varProps = typeof props === "string" ? { value: props } : props;
    const existingVar = this.getVariables()[i];
    if (! existingVar) return null;

    console.log(`setVariableAt() updating variable at index ${i}: ${JSON.stringify(existingVar)}`);

    // TODO: remove duplication with addOrUpdateVariable()
    const newVariables = this.getVariables().map((v, index) => index == i ? 
      { 
        name: varProps.name || existingVar.name, 
        values: existingVar.values.find(v => v.env == env) ? existingVar.values.map(v => v.env == env ? { env, value: varProps.value || v.value } : v) : [ ...existingVar.values, { env, value: varProps.value } ]
      } : v );
    this.setState({ isModified: true, vars: newVariables })
    return newVariables;
  }

  getVariableAt(env, i) {
    const variable = this.getVariables()[i];
    if (! variable) return null;
    const value = R.find(R.propEq("env", env), variable.values);
    return value ? R.find(R.propEq("env", env), variable.values).value : null;
  }

  addEmptyVariable(name = '') {
    // const variable = R.find(R.propEq("name", name), this.getVariables());
    // if (variable) return variable;
    const newVar = { name, values: []};
    const newVariables = [ ...this.getVariables(), newVar];
    this.setState({ isModified: true, vars: newVariables });
    return newVariables;
  }

  createNewVariable(env, name, value) {
    return { name, values: [{ env, value }]};
  }

  getVariables() {
    return this.state.vars;
  }

  getVariableByName(env, name) {
    const variable = R.find(R.propEq("name", name), this.getVariables());
    if (! variable) return null;
    const value = R.find(R.propEq("env", env), variable.values);
    if (! value) return null;
    return value.value;
  }

  setEnvironmentName(prevName, name) {
    // TODO: make sure we are not causing env name collisions
    // TODO: convert below to use R ??
    const newVariables = this.getVariables().map(v => 
      (
        { 
          name: v.name, 
          values: v.values.map((v, i) => v.env == prevName ? { ...v, env: name } : v) 
        }
      ));
    this.setState({ isModified: true, vars: newVariables });
    return newVariables;
  }
}
export default new ContextContainer();