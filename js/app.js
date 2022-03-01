App = {
  data() {
    return {
      searchTerm: '',
  	  data: {
    		raw: [],
    		filtered: [],
    		tree: []
  	  },
      props: {
        children: 'children',
        label: 'label',
      }
    };
  },
  methods: {
  	toTree() {
  	  list = this.data.filtered;
  	  var map = {}, node, roots = [], i;

  	  for (i = 0; i < list.length; i += 1) {
    		map[list[i].id] = i;
    		list[i].children = [];
	    }

  	  for (i = 0; i < list.length; i += 1) {
  		    node = list[i];
  		    if (node.parentId !== " ") {
  		        list[map[node.parentId]].children.push(node);
  		    } else {
  		        roots.push(node);
  		    }
  	  }
  	  this.data.tree = roots;
  	},
    filter(searchTerm, nodes) {
      return nodes.searchTerms.toUpperCase().includes(searchTerm.toUpperCase())
    },
  },
  mounted() {
    self = this;
    Papa.parse('data/icd10.csv', {
        download: true,
        header: true,
        complete: function (result) {
			    self.data.raw = _.map(result.data, function (item) {
    				item['id'] = item.desc + ' (' + item.code + ')';
    				item['label'] = item.desc + ' (' + item.code + ')';
    				item['searchTerms'] = item['parents'] + '|' + item.desc + '|' + item.code + '|' + item.includes;
    				if (item['parent(s)'] == '') {
    					item['parentId'] = ' '
    				} else {
    					arr = item['parent(s)'].split(' > ');
    					item['parentId'] = arr[arr.length - 1]
    				}
    				item.includes = {
    					str: item.includes,
    					arr: item.includes ? item.includes.split(';') : ''
    				};
    				item.excludes = {
    					str: item.excludes,
    					arr: item.excludes ? item.excludes.split(';') : ''
    				};
    				item['children'] = null
    				return item;
			    })
    			self.data.filtered = self.data.raw;
    			self.toTree();
        },
      }
    );
  },
  watch: {
    searchTerm(val) {
      this.$refs.tree.filter(val)
    },
  }
};

var app = Vue.createApp(App);
app.use(ElementPlus);
app.mount('#app')
