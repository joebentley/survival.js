// import '../node_modules/mocha/mocha.js';
import 'mocha/mocha.css';
import 'mocha/mocha.js';

import './test.js';
import './entity.test.js';

mocha.checkLeaks();
mocha.run();