import { createElement, hydrate } from 'preact';
import { setupScratch, teardown } from '../../../test/_util/helpers';
import { useLayoutEffect } from 'preact/hooks';
import { useEffectAssertions } from './useEffectAssertions.test';

/** @jsx createElement */

describe('combinations', () => {
	/** @type {HTMLDivElement} */
	let scratch;

	beforeEach(() => {
		scratch = setupScratch();
	});

	afterEach(() => {
		teardown(scratch);
	});

	// Layout effects fire synchronously
	const scheduleEffectAssert = assertFn =>
		new Promise(resolve => {
			assertFn();
			resolve();
		});

	useEffectAssertions(useLayoutEffect, scheduleEffectAssert);

	it('does not throw error on hydration', () => {
		const cleanupFunction = sinon.spy();
		const callback = sinon.spy(() => cleanupFunction);

		function Comp() {
			useLayoutEffect(callback);
			return <div>hello</div>;
		}

		hydrate(<Comp />, scratch);

		expect(callback).to.be.calledOnce;
	});
});
