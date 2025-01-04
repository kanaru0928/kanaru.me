import * as Dialog from "@radix-ui/react-dialog";
import { css } from "styled-system/css";
import { HambergerContent } from "./hamberger-content";
import { IconX } from "@tabler/icons-react";

export function HambergerDialog() {
  return (
    <Dialog.Portal>
      <Dialog.Overlay
        className={css({
          bg: "zinc.900/80",
          position: "fixed",
          inset: 0,
          animation: "fadeIn 0.2s",
          backdropBlur: "sm",
          backdropFilter: "auto",
          zIndex: 100,
        })}
      />
      <Dialog.Content
        className={css({
          position: "fixed",
          inset: 0,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          animation: "fadeIn 0.2s",
          zIndex: 101,
        })}
      >
        <Dialog.Title
          className={css({
            fontSize: "xl",
            fontWeight: "bold",
            color: "white",
          })}
        >
          Menu
        </Dialog.Title>
        <Dialog.Description className={css({ color: "white" })}>
          リンク一覧
        </Dialog.Description>
        <HambergerContent />
        <Dialog.Close asChild>
          <button
            className={css({
              position: "fixed",
              top: 0,
              right: 0,
              color: "white",
              cursor: "pointer",
            })}
          >
            <IconX />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
