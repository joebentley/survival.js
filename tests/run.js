// import '../node_modules/mocha/mocha.js';
import css from 'mocha/mocha.css';
import 'mocha/mocha.js';

import './test.js';

mocha.checkLeaks();
mocha.run();