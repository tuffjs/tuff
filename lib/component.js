var snabbdom = require('snabbdom/snabbdom');
var h = snabbdom.h;
var snabbdomPatch = snabbdom.init([
  require('snabbdom/modules/props').default,
  require('snabbdom/modules/style').default,
  require('snabbdom/modules/eventlisteners').default,
]);

function copyToThunk (vnode, thunk) {
  thunk.elm = vnode.elm;
  vnode.data.component = thunk.data.component;
  thunk.data = vnode.data;
  thunk.children = vnode.children;
  thunk.text = vnode.text;
  thunk.elm = vnode.elm;
}

module.exports = {
  // vnode: null,
  // cachedView: null,

  invalidate: function invalidate () {
    this.cachedView = null;
  },

  getTagName: function getTagName () {
    if (!this.tagName) {
      this.cachedView = this.view(h);
      this.tagName = this.cachedView.sel;
    }

    return this.tagName;
  },

  mount: function mount (node) {
    this.vnode = node;
  },

  init: function init () {
    this.vnode = null;
    this.cachedView = null;

    return this;
  },

  render: function render () {
    if (this.vnode) {
      var view = this.cachedView || this.view(h);
      this.vnode = snabbdomPatch(this.vnode, view);
    } else {
      // The component is not visible.
      console.log('WARNING: rendering an invisible component ', this);
    }
  },

  view: function view (h) {
  },

  comp: function hComp () {
    var component = this;
    return h(component.getTagName(),
      { component: component,
        hook:
        { init:
          function init (thunk) {
            //console.log('INIT:', component, thunk);
            // We calling component's view().
            // DOM element may be created here.
            copyToThunk(thunk.data.component.view(h), thunk);
            component.vnode = thunk;
          },

          prepatch:
          function prepatch (vnode, thunk) {

            // Elements level callback, not components-level.

            // If another component replaces in-place the previous
            // but their wrapping tags are the same,
            // prepatch of previous component will be called.

            //console.log('PREPATCH:', vnode, thunk, component);

            if (vnode.data.component === component) {
              copyToThunk(vnode, thunk);

            } else {
              // Reuse of an existing vnode
              // Snabbdom can provide existing DOM element here to
              // reuse by the renderer, even if component was changed.
              // That's ok. It gives us the previous vnode which we'll patch against.
              copyToThunk(thunk.data.component.view(h), thunk);
              component.vnode = thunk;
              vnode.data.component.vnode = null;
              vnode.data.component = null;
            }
          },
        },
      },
    );
  }
};
