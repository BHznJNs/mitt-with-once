import mitt from '../src';
import { expect } from 'chai';

describe('mitt.once', () => {
  it('should call the handler once and then remove it', () => {
    const emitter = mitt<{ foo: undefined }>();
    let callCount = 0;
    const handler = () => {
      callCount++;
    };

    emitter.once('foo', handler);
    emitter.emit('foo');
    emitter.emit('foo'); // Should not call the handler again

    expect(callCount).to.equal(1);
  });

  it('should pass arguments to the once handler', () => {
    const emitter = mitt<{ bar: string }>();
    let receivedArg: string | undefined;
    const handler = (arg: string) => {
      receivedArg = arg;
    };

    emitter.once('bar', handler);
    emitter.emit('bar', 'test-arg');

    expect(receivedArg).to.equal('test-arg');
  });

  it('should work with multiple once handlers for the same event', () => {
    const emitter = mitt<{ baz: undefined }>();
    let callCount1 = 0;
    let callCount2 = 0;

    const handler1 = () => {
      callCount1++;
    };
    const handler2 = () => {
      callCount2++;
    };

    emitter.once('baz', handler1);
    emitter.once('baz', handler2);

    emitter.emit('baz');
    emitter.emit('baz'); // Should not call handlers again

    expect(callCount1).to.equal(1);
    expect(callCount2).to.equal(1);
  });

  it('should not call once handler if event is not emitted', () => {
    const emitter = mitt<{ qux: undefined }>();
    let callCount = 0;
    const handler = () => {
      callCount++;
    };

    emitter.once('qux', handler);
    // Event 'qux' is never emitted

    expect(callCount).to.equal(0);
  });

  it('should allow mixing once and on handlers', () => {
    const emitter = mitt<{ mixed: undefined }>();
    let onceCallCount = 0;
    let onCallCount = 0;

    const onceHandler = () => {
      onceCallCount++;
    };
    const onHandler = () => {
      onCallCount++;
    };

    emitter.once('mixed', onceHandler);
    emitter.on('mixed', onHandler);

    emitter.emit('mixed');
    emitter.emit('mixed');

    expect(onceCallCount).to.equal(1);
    expect(onCallCount).to.equal(2);
  });
});
