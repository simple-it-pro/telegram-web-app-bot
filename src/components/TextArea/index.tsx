import {
  ChangeEventHandler,
  TextareaHTMLAttributes,
  forwardRef,
  useRef,
  useEffect,
  useState,
  FocusEventHandler,
} from 'react';
import classNames from 'classnames';

import classes from './style.module.scss';

const changeTextAreaStyles = ({
  textArea,
  label,
  error,
  changeLabel = true,
}: {
  textArea: HTMLTextAreaElement;
  label: HTMLLabelElement;
  error: HTMLDivElement | null;
  changeLabel?: boolean;
}) => {
  textArea.style.height = '1px';
  textArea.style.height = textArea.scrollHeight + 'px';

  label.style.transform = `translate(12px, ${
    changeLabel ? textArea.scrollHeight - 8 : 12
  }px)`;

  if (error) error.style.top = -8 + textArea.scrollHeight + 'px';
};

type TextareaProps = {
  label?: string;
  error?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'placeholder'>;

const TextArea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, label, onChange, onFocus, onBlur, className, ...props }, ref) => {
    const [isLabelDown, setLabelDown] = useState(false);
    const [errorDivWidth, setErrorDivWidth] = useState(-28);

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const errorMessageRef = useRef<HTMLDivElement | null>(null);

    const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
      if (event.target.value.trim()) onChange && onChange(event);
      else event.target.value = '';

      if (textareaRef.current)
        changeTextAreaStyles({
          textArea: textareaRef.current,
          label: textareaRef.current?.nextSibling as HTMLLabelElement,
          error: errorMessageRef.current,
        });
    };

    const handleTextareaFocus: FocusEventHandler<HTMLTextAreaElement> = (
      event,
    ) => {
      if (textareaRef.current) {
        changeTextAreaStyles({
          textArea: textareaRef.current,
          label: textareaRef.current?.nextSibling as HTMLLabelElement,
          error: errorMessageRef.current,
        });
      }
      setLabelDown(true);
      onFocus && onFocus(event);
    };

    const handleTextareaBlur: FocusEventHandler<HTMLTextAreaElement> = (
      event,
    ) => {
      if (!textareaRef.current?.value) {
        setLabelDown(false);
        (textareaRef.current?.nextSibling as HTMLLabelElement).style.transform =
          'translate(12px, 12px)';
      }
      onBlur && onBlur(event);
    };

    const handleLabelClick = () => textareaRef.current?.focus();

    useEffect(() => {
      if (textareaRef.current?.value) setLabelDown(true);

      if (textareaRef.current) {
        changeTextAreaStyles({
          textArea: textareaRef.current,
          label: textareaRef.current?.nextSibling as HTMLLabelElement,
          error: errorMessageRef.current,
          changeLabel: !!textareaRef.current?.value,
        });
      }
    }, []);

    useEffect(() => {
      setErrorDivWidth(errorMessageRef.current?.clientWidth || -28);
    }, [error]);

    return (
      <div className={classNames(className, classes.textarea)}>
        <textarea
          className={classes.textarea_input}
          ref={(node) => {
            textareaRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          {...props}
          onChange={handleChange}
          onFocus={handleTextareaFocus}
          onBlur={handleTextareaBlur}
        />
        <label
          className={classNames(classes.textarea_label, {
            [classes.textarea_label__floating]: isLabelDown,
          })}
          style={{
            width: isLabelDown
              ? `calc(100% - ${errorDivWidth + 28}px)`
              : 'unset',
          }}
          onClick={handleLabelClick}
        >
          {label}
        </label>
        {error && (
          <div ref={errorMessageRef} className={classes.textarea_error}>
            {error}
          </div>
        )}
      </div>
    );
  },
);

export default TextArea;
