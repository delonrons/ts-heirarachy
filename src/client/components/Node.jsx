import React from 'react';
import Explanation from "./Explanation";

const Node = ({ node = {}, onSubmit, onCancel, explanation, notify }) => {
  const idInput = React.useRef();
  const parentInput = React.useRef();

  const clearForm = () => {
    idInput.current.value ='';
    parentInput.current.value = '';
  }

  return (
    <form data-ts="Form">
      {notify &&
      <div data-ts="Note">
        <i className="ts-icon-heart"></i>
        <p>{notify}</p>
      </div>
      }
      <fieldset>
        {explanation && <Explanation title={explanation.title} type={explanation.type} explanations={explanation.explanations} />}
        <label>
          <span>Node Id</span>
          <input type="text"
                 name="id"
                 ref={idInput}
                 required={true}
                 defaultValue={node?.id || ''}
                 readOnly={!!node.id}
                 onChange={({ target }) => node.id = target.value}
          />
        </label>

        <label>
          <span>Parent</span>
          <input type="text"
                 name="parent"
                 ref={parentInput}
                 defaultValue={node?.parent || ''}
                 onChange={({ target }) => node.parent = target.value}
          />
        </label>

        <Explanation title="Root Node" type="info" explanations={["Leave the field empty if this a root node"]} />

        { node.id && <label key={node.height}>
            <span>Node Height</span>
            <input type="text" name="height" defaultValue={node.height || 0} readOnly/>
          </label>
        }

        { node.id && <label key={node.root}>
          <span>Node Root</span>
          <input type="text" name="root" defaultValue={node.root || ''} readOnly/>
        </label>
        }

        <label>
          <button
            data-ts="Button"
            type="submit"
            onClick={() => {
              onSubmit(node, clearForm);
            }}
            className="ts-primary">
            <span>{ node.id ? 'Update': 'Add' }</span>
          </button>

          { node.id && <button data-ts="Button" onClick={() => onCancel(clearForm)} className="ts-secondary">
            <span>Cancel</span>
          </button>}
        </label>
      </fieldset>
    </form>
  )
}

export default Node;