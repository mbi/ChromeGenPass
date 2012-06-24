/*!
SuperGenPass for Google Chrome™ by Denis
Copyright (C) 2010 Denis Sokolov http://sokolov.cc

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var storage = (function(){
	var settings = {
		passwords: [],
		whitelist: []
	};

	var load = function(){
		chrome.storage.sync.get('settings', function(s){
			if ('settings' in s) {
				settings = s.settings;
			}
		});
	};

	/**
	 * Merge two arrays, ignoring identical elements
	 * @param callback key Identity function of an element
	 */
	var merge = function(one, two, key) {
		key = key || function(i){ return i; };
		var names = one.map(key);
		two.forEach(function(p){
			if (names.indexOf(key(p)) < 0) {
				one.passwords.push(p);
			}
		});
		return one;
	};

	var save = function(){ chrome.storage.sync.set({ settings: settings }); };

	load();

	// Retrieve legacy passwords
	if ('passwords' in localStorage && localStorage.passwords.indexOf('//CGPSEP/$$}}//') > -1) {
		var t = [];
		localStorage.passwords.split('//CGPSEP2/$$}}//').forEach(function(password){
			item = password.split('//CGPSEP/$$}}//');
			t.push({
				'note': item[0],
				'len': item[1],
				'hash': item[2]
			});
		});
		settings.passwords = merge(settings.passwords, t, function(p) {
			return p.note + p.len + p.hash;
		});
		save();
		delete localStorage.passwords;
	}

	// Retrieve newer legacy settings
	if ('settings' in localStorage) {
		var s = JSON.parse(localStorage.settings);
		if ('passwords' in s) {
			settings.passwords = merge(settings.passwords, s.passwords, function(p) {
				return p.note + p.len + p.hash;
			});
		}
		if ('whitelist' in s) {
			settings.whitelist = merge(settings.whitelist, s.whitelist);
		}
		save();
		delete localStorage.settings;
	}

	var api = function(data){
		if (data) {
			settings = data;
			save();
		} else {
			return settings;
		}
	};

	api.passwords = function(data){
		if (data) {
			settings.passwords = data;
			save();
		} else {
			return settings.passwords;
		}
	};

	api.whitelist = function(data) {
		if (data) {
			settings.whitelist = data;
			save();
		} else {
			return settings.whitelist;
		}
	};

	return api;
})();
